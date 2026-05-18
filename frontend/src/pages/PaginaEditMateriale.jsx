import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import { useLocation, useParams } from 'react-router-dom';
import { useSidebar } from '../context/SidebarContext';
import { useAuth } from '../context/AuthContext'; 

import creionIcon from '../assets/creion.png';
import gumaIcon from '../assets/gumasters.png';
import stickyIcon from '../assets/stuckynote.png';
import textIcon from '../assets/icontext.png';

import pixIcon from '../assets/pix.png';
import highlighterIcon from '../assets/highlighter.png';

const API_URL_MATERIALS = '/api/materials';

const loadPdfJs = () => {
  return new Promise((resolve, reject) => {
    if (window.pdfjsLib) {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      resolve(window.pdfjsLib);
      return;
    }

    const existing = document.getElementById('pdfjs-script');

    if (existing) {
      existing.onload = () => {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        resolve(window.pdfjsLib);
      };
      return;
    }

    const script = document.createElement('script');
    script.id = 'pdfjs-script';
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';

    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      resolve(window.pdfjsLib);
    };

    script.onerror = reject;
    document.head.appendChild(script);
  });
};

function PaginaEditMateriale() {
  const params = useParams();
  const location = useLocation();
  const { collapsed } = useSidebar();
  const { token } = useAuth(); 
  const isIframe = window.self !== window.top;
  const sidebarWidth = isIframe ? 0 : (collapsed ? 64 : 210);

  const materialId = params.id; 
  const [numeMaterie, setNumeMaterie] = useState('Se încarcă...'); 

  const canvasRef = useRef(null);
  const boardRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const fabricRef = useRef(null);
  const fileInputRef = useRef(null);

  const undoStackRef = useRef([]);
  const redoStackRef = useRef([]);
  const isRestoringRef = useRef(false);
  const saveTimeoutRef = useRef(null);
  const loadedRouteFileRef = useRef(false);
  const lastScrollTopRef = useRef(0);

  const stickyBaseColor = '#fff4a8';
  const stickyTextColor = '#000000';

  const LEFT_BAR_WIDTH = 112;
  const TOP_EDITOR_HEIGHT = 56;
  const CANVAS_HEIGHT = 6000;

  const canvasHeightRef = useRef(CANVAS_HEIGHT);

  const [tool, setTool] = useState('pen');
  const [activePanel, setActivePanel] = useState(null);
  const [paperType, setPaperType] = useState('blank');

  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedFileType, setUploadedFileType] = useState('');
  const [nativePdfUrl, setNativePdfUrl] = useState(null); 
  const [canvasHeight, setCanvasHeight] = useState(CANVAS_HEIGHT);
  const [saveStatus, setSaveStatus] = useState('');
  const [topBarsHidden, setTopBarsHidden] = useState(false);

  const [selectedShape, setSelectedShape] = useState(null);
  const [selectedSticky, setSelectedSticky] = useState(null);
  const [stickyColor, setStickyColor] = useState('#fff4a8');

  const [shapePanel, setShapePanel] = useState({
    strokeColor: '#000000',
    fillColor: '#ffffff',
    hasFill: true,
  });

  const [penSettings, setPenSettings] = useState({
    color: '#000000',
    width: 4,
    mode: 'pen',
  });

  useEffect(() => {
    canvasHeightRef.current = canvasHeight;
  }, [canvasHeight]);

  const detectSavedFileFromCanvas = (canvas) => {
    const pdfPage = canvas.getObjects().find((obj) => obj.customType === 'pdfPage');

    if (pdfPage) {
      setUploadedFileType('pdf');
      setUploadedFileName(pdfPage.fileName || 'PDF salvat');
    }
  };

  const updateCanvasHeightFromObjects = (canvas) => {
    const objects = canvas.getObjects();

    const maxBottom = objects.reduce((max, obj) => {
      const scaledHeight = (obj.height || 0) * (obj.scaleY || 1);
      const bottom = (obj.top || 0) + scaledHeight;
      return Math.max(max, bottom);
    }, CANVAS_HEIGHT);

    const nextHeight = Math.max(CANVAS_HEIGHT, maxBottom + 180);

    canvasHeightRef.current = nextHeight;
    setCanvasHeight(nextHeight);

    if (scrollContainerRef.current) {
      canvas.setDimensions({
        width: scrollContainerRef.current.clientWidth,
        height: nextHeight,
      });
    }

    canvas.requestRenderAll();
  };

  const incarcaCanvasDinBackend = async (canvas) => {
    if (!canvas || !materialId || !token) return;

    try {
      const res = await fetch(`${API_URL_MATERIALS}/note/${materialId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        console.error('Nu s-a putut încărca materialul:', res.status, data);
        return;
      }

      if (data?.materialId) {
        setNumeMaterie(data.nume);
      } else if (data?.nume) {
        setNumeMaterie(data.nume);
      }

      if (data?.paperType) {
        setPaperType(data.paperType);
      }

      if (data?.canvasData) {
        let parsed = data.canvasData;
        if (typeof data.canvasData === 'string') {
          try { parsed = JSON.parse(data.canvasData); } catch(e) {}
        }

        // Setăm URL-ul PDF pe canvas 
        const savedPdfUrl = parsed?.nativePdfUrl || null;
        if (savedPdfUrl) {
          setNativePdfUrl(savedPdfUrl);
          setUploadedFileType('pdf');
          canvas.nativePdfUrl = savedPdfUrl;
        }

        isRestoringRef.current = true;

        // incarcam obiectele din canvas 
        const result = canvas.loadFromJSON(parsed || data.canvasData);
        if (result && typeof result.then === 'function') {
          await result;
        }

        isRestoringRef.current = false;

        // Daca exista PDF salvat, il re-renderam din URL
        if (savedPdfUrl) {
          const fileName = parsed?.pdfFileName || 'document.pdf';
          setUploadedFileName(fileName);
          stergePdfVechi(canvas);
          await loadPdfFromUrl(savedPdfUrl);
        } else {
          detectSavedFileFromCanvas(canvas);
          updateCanvasHeightFromObjects(canvas);
        }
      }
    } catch (err) {
      console.error('Eroare la încărcarea materialului:', err);
      isRestoringRef.current = false;
    }
  };

  const salveazaCanvasInBackend = async () => {
    const canvas = fabricRef.current;

   
    if (!canvas || !materialId || isRestoringRef.current || !token || numeMaterie === 'Se încarcă...') return;

    try {
      setSaveStatus('Se salvează...');

      const activeObject = canvas.getActiveObject();

      if (activeObject && activeObject.isEditing && typeof activeObject.exitEditing === 'function') {
        activeObject.exitEditing();
        canvas.discardActiveObject();
        canvas.requestRenderAll();
      }

      const cursors = canvas
        .getObjects()
        .filter((obj) => obj.customType === 'eraserCursor');

      cursors.forEach((cursor) => canvas.remove(cursor));

      const canvasDataObj = canvas.toJSON([
        'customType',
        'stickyId',
        'fileName',
        'fileType',
        'pageNumber',
      ]);

      // Excludem imaginile PDF 
      canvasDataObj.objects = (canvasDataObj.objects || []).filter(
        (obj) => obj.customType !== 'pdfPage' && obj.customType !== 'pdfBackground'
      );

      // Salvam URL-ul PDF și textul extras 
      const pdfUrlToSave = nativePdfUrl || canvas.nativePdfUrl || null;
      if (pdfUrlToSave) {
        canvasDataObj.nativePdfUrl = pdfUrlToSave;
        canvasDataObj.pdfFileName = uploadedFileName || '';
        // Textul extras per pagina
        if (canvas.pdfTextContent) {
          canvasDataObj.pdfTextContent = canvas.pdfTextContent;
        }
      }

      cursors.forEach((cursor) => canvas.add(cursor));

      const payload = {
        nume: numeMaterie,
        paperType,
        canvasData: canvasDataObj,
      };

      //  Ruta modificata catre /note/:id
      const res = await fetch(`${API_URL_MATERIALS}/note/${materialId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        console.error('Nu s-a salvat în backend:', res.status, data);
        setSaveStatus('Eroare salvare');
        return;
      }

      setSaveStatus('Salvat');

      setTimeout(() => {
        setSaveStatus('');
      }, 1800);
    } catch (err) {
      console.error('Eroare la salvarea materialului:', err);
      setSaveStatus('Eroare backend');
    }
  };

  const programeazaSalvareCanvas = () => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      salveazaCanvasInBackend();
    }, 2500); // Debounce pentru autosave
  };

  useEffect(() => {
    if (!canvasRef.current || !boardRef.current) return;

    if (fabricRef.current) {
      fabricRef.current.dispose();
      fabricRef.current = null;
    }

    const canvas = new fabric.Canvas(canvasRef.current, {
      isDrawingMode: true,
      backgroundColor: 'transparent',
      selection: true,
      preserveObjectStacking: true,
      allowTouchScrolling: true,
    });

    fabricRef.current = canvas;

    const handleCanvasWheel = (event) => {
      const scrollContainer = scrollContainerRef.current;
      if (!scrollContainer) return;

      event.preventDefault();
      event.stopPropagation();

      scrollContainer.scrollBy({
        top: event.deltaY,
        left: 0,
        behavior: 'auto',
      });
    };

    canvas.upperCanvasEl?.addEventListener('wheel', handleCanvasWheel, {
      passive: false,
    });

    canvas.lowerCanvasEl?.addEventListener('wheel', handleCanvasWheel, {
      passive: false,
    });

    resizeCanvasToBoard(canvas);
    applyBrushSettings(canvas, 'pen', penSettings);

    incarcaCanvasDinBackend(canvas).then(async () => {
      saveHistory();

      if (loadedRouteFileRef.current) return;

      const routeFile = location.state?.uploadedFile;
      const routeFileUrl = location.state?.uploadedFileUrl;
      const routeFileName = location.state?.uploadedFileName;
      const routeFileType = location.state?.uploadedFileType;

      loadedRouteFileRef.current = true;

      if (routeFileUrl && routeFileName) {
        try {
          const response = await fetch(routeFileUrl);
          const blob = await response.blob();

          const file = new File([blob], routeFileName, {
            type: blob.type || (routeFileType === 'pdf' ? 'application/pdf' : 'application/octet-stream'),
          });

          setUploadedFileName(routeFileName);

          if (routeFileType === 'pdf') {
            setUploadedFileType('pdf');
            await renderPdfInsideEditor(file);
          } else if (routeFileType === 'ppt' || routeFileType === 'pptx') {
            setUploadedFileType('ppt');
            setSaveStatus('PPT încărcat');
            setTimeout(() => setSaveStatus(''), 1800);
          } else if (['png', 'jpg', 'jpeg'].includes(routeFileType)) {
            // Future image processing
          }
        } catch (err) {
          console.error('Nu s-a putut încărca fișierul din pagina inițială:', err);
          setSaveStatus('Eroare fișier');
        }
        return;
      }
    });

    const resizeObserver = new ResizeObserver(() => {
      if (!boardRef.current || !fabricRef.current || !scrollContainerRef.current) return;

      fabricRef.current.setDimensions({
        width: scrollContainerRef.current.clientWidth,
        height: canvasHeightRef.current || CANVAS_HEIGHT,
      });

      fabricRef.current.requestRenderAll();
    });

    if (scrollContainerRef.current) {
      resizeObserver.observe(scrollContainerRef.current);
    }

    canvas.on('object:added', saveHistory);
    canvas.on('object:modified', saveHistory);
    canvas.on('object:removed', saveHistory);

    canvas.on('selection:created', handleSelection);
    canvas.on('selection:updated', handleSelection);
    canvas.on('selection:cleared', () => {
      setSelectedShape(null);
      setSelectedSticky(null);
    });

    canvas.on('object:moving', keepStickyTogether);
    canvas.on('mouse:dblclick', handleCanvasDoubleClick);

    canvas.on('text:editing:entered', (e) => {
      if (e.target.text === 'Scrie aici...' || e.target.text === 'Scrie text...') {
        e.target.text = '';
        canvas.requestRenderAll();
        saveHistory();
      }
    });

    canvas.on('text:changed', () => {
      saveHistory();
    });

    canvas.on('text:editing:exited', () => {
      saveHistory();
    });

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActivePanel(null);
        setTool('select');

        if (fabricRef.current) {
          fabricRef.current.discardActiveObject();
          fabricRef.current.requestRenderAll();
        }

        if (document.activeElement) {
          document.activeElement.blur();
        }

        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        undo();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
        return;
      }

      if (e.key !== 'Delete' && e.key !== 'Backspace') return;

      const activeObject = canvas.getActiveObject();
      if (!activeObject) return;
      if (activeObject.isEditing) return;

      const activeObjects = canvas.getActiveObjects();

      activeObjects.forEach((obj) => {
        if (obj.customType === 'pdfPage' || obj.customType === 'pdfBackground') return;

        if (obj.stickyId) {
          removeStickyById(obj.stickyId);
        } else {
          canvas.remove(obj);
        }
      });

      canvas.discardActiveObject();
      canvas.requestRenderAll();
      saveHistory();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      resizeObserver.disconnect();

      canvas.upperCanvasEl?.removeEventListener('wheel', handleCanvasWheel);
      canvas.lowerCanvasEl?.removeEventListener('wheel', handleCanvasWheel);

      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      canvas.off('object:added', saveHistory);
      canvas.off('object:modified', saveHistory);
      canvas.off('object:removed', saveHistory);

      canvas.off('selection:created', handleSelection);
      canvas.off('selection:updated', handleSelection);
      canvas.off('selection:cleared');

      canvas.off('object:moving', keepStickyTogether);
      canvas.off('mouse:dblclick', handleCanvasDoubleClick);
      canvas.off('text:editing:entered');
      canvas.off('text:changed');
      canvas.off('text:editing:exited');

      window.removeEventListener('keydown', handleKeyDown);

      canvas.dispose();
      fabricRef.current = null;
    };
  }, [token]); // Re-init la token

  useEffect(() => {
    if (!fabricRef.current) return;
    programeazaSalvareCanvas();
  }, [paperType]);

  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    canvas.getObjects().forEach((obj) => {
      if (obj.customType === 'eraserCursor') {
        canvas.remove(obj);
      }
    });

    canvas.off('path:created');
    canvas.off('mouse:down');
    canvas.off('mouse:move');
    canvas.off('mouse:up');
    canvas.off('mouse:over');
    canvas.off('mouse:out');

    canvas.isDrawingMode = false;
    canvas.selection = false;
    canvas.skipTargetFind = false;
    canvas.defaultCursor = 'default';
    canvas.hoverCursor = 'move';

    canvas.getObjects().forEach((obj) => {
      obj.selectable = true;
      obj.evented = true;

      if (obj.customType === 'stickyFold') {
        obj.selectable = false;
        obj.evented = false;
      }

      if (obj.customType === 'pdfPage' || obj.customType === 'pdfBackground') {
        obj.selectable = false;
        obj.evented = false;
      }
    });

    if (tool === 'pen') {
      canvas.isDrawingMode = true;
      canvas.selection = false;
      canvas.skipTargetFind = true;
      canvas.defaultCursor = 'crosshair';

      applyBrushSettings(canvas, tool, penSettings);

      canvas.on('path:created', (opt) => {
        if (!opt.path) return;

        opt.path.set({
          globalCompositeOperation: 'source-over',
          opacity: 1,
          selectable: true,
          evented: true,
        });

        canvas.requestRenderAll();
        saveHistory();
      });
    }

    if (tool === 'eraser') {
      canvas.isDrawingMode = false;
      canvas.selection = false;
      canvas.defaultCursor = 'none';
      canvas.hoverCursor = 'none';

      canvas.getObjects().forEach((obj) => {
        obj.selectable = false;
        obj.evented = true;

        if (obj.customType === 'pdfPage' || obj.customType === 'pdfBackground') {
          obj.evented = false;
        }
      });

      const eraserSize = Math.max(penSettings.width + 5, 15);

      const eraserCursor = new fabric.Circle({
        radius: eraserSize,
        fill: 'rgba(255, 80, 80, 0.4)',
        stroke: '#ff0000',
        strokeWidth: 1,
        originX: 'center',
        originY: 'center',
        left: -1000,
        top: -1000,
        opacity: 0,
        selectable: false,
        evented: false,
        customType: 'eraserCursor',
      });

      canvas.add(eraserCursor);

      let isErasing = false;

      const performErase = (pointer) => {
        let removedSomething = false;
        const objects = canvas.getObjects();

        for (let i = objects.length - 1; i >= 0; i--) {
          const obj = objects[i];

          if (obj.customType === 'eraserCursor') continue;
          if (obj.customType === 'pdfPage') continue;
          if (obj.customType === 'pdfBackground') continue;

          if (obj.intersectsWithObject(eraserCursor) || obj.containsPoint(pointer)) {
            if (obj.stickyId) {
              removeStickyById(obj.stickyId);
            } else {
              canvas.remove(obj);
            }

            removedSomething = true;
          }
        }

        return removedSomething;
      };

      canvas.on('mouse:down', (e) => {
        isErasing = true;

        const pointer = canvas.getPointer(e.e);

        eraserCursor.set({
          left: pointer.x,
          top: pointer.y,
          opacity: 1,
        });

        eraserCursor.setCoords();

        performErase(pointer);
        canvas.requestRenderAll();
      });

      canvas.on('mouse:move', (e) => {
        const pointer = canvas.getPointer(e.e);

        eraserCursor.set({
          left: pointer.x,
          top: pointer.y,
          opacity: 1,
        });

        eraserCursor.setCoords();

        if (isErasing) {
          performErase(pointer);
        }

        canvas.requestRenderAll();
      });

      canvas.on('mouse:up', () => {
        isErasing = false;
        saveHistory();
      });

      canvas.on('mouse:out', () => {
        eraserCursor.set({ opacity: 0 });
        canvas.requestRenderAll();
      });
    }

    if (tool === 'select') {
      canvas.isDrawingMode = false;
      canvas.selection = true;
      canvas.skipTargetFind = false;
      canvas.defaultCursor = 'default';
      canvas.hoverCursor = 'move';

      canvas.getObjects().forEach((obj) => {
        if (obj.customType === 'pdfPage' || obj.customType === 'pdfBackground') {
          obj.selectable = false;
          obj.evented = false;
        }
      });
    }

    canvas.requestRenderAll();
  }, [tool, penSettings]);

  const resizeCanvasToBoard = (canvas) => {
    if (!scrollContainerRef.current || !canvas) return;

    canvas.setDimensions({
      width: scrollContainerRef.current.clientWidth,
      height: canvasHeightRef.current || CANVAS_HEIGHT,
    });

    canvas.requestRenderAll();
  };

  const saveHistory = () => {
    const canvas = fabricRef.current;
    if (!canvas || isRestoringRef.current) return;

    isRestoringRef.current = true;

    const cursors = canvas.getObjects().filter((o) => o.customType === 'eraserCursor');
    cursors.forEach((c) => canvas.remove(c));

    const json = canvas.toJSON([
      'customType',
      'stickyId',
      'fileName',
      'fileType',
      'pageNumber',
    ]);

    undoStackRef.current.push(json);

    if (undoStackRef.current.length > 60) {
      undoStackRef.current.shift();
    }

    redoStackRef.current = [];

    cursors.forEach((c) => canvas.add(c));
    isRestoringRef.current = false;

    programeazaSalvareCanvas(); //  Autosave
  };

  const restoreCanvas = async (json) => {
    const canvas = fabricRef.current;
    if (!canvas || !json) return;

    isRestoringRef.current = true;

    const result = canvas.loadFromJSON(json);

    if (result && typeof result.then === 'function') {
      await result;
    }

    canvas.getObjects().forEach((obj) => {
      if (obj.customType === 'pdfPage' || obj.customType === 'pdfBackground') {
        obj.selectable = false;
        obj.evented = false;
      }
    });

    updateCanvasHeightFromObjects(canvas);

    canvas.requestRenderAll();
    isRestoringRef.current = false;
  };

  const undo = async () => {
    if (undoStackRef.current.length <= 1) return;

    const current = undoStackRef.current.pop();
    redoStackRef.current.push(current);

    const previous = undoStackRef.current[undoStackRef.current.length - 1];

    await restoreCanvas(previous);
    programeazaSalvareCanvas();
  };

  const redo = async () => {
    if (redoStackRef.current.length === 0) return;

    const next = redoStackRef.current.pop();
    undoStackRef.current.push(next);

    await restoreCanvas(next);
    programeazaSalvareCanvas();
  };

  const handleSelection = (e) => {
    const obj = e.selected?.[0];
    const canvas = fabricRef.current;

    if (!obj) {
      setSelectedShape(null);
      setSelectedSticky(null);
      return;
    }

    if (obj.customType === 'pdfPage' || obj.customType === 'pdfBackground') {
      canvas.discardActiveObject();
      canvas.requestRenderAll();
      return;
    }

    if (obj.customType === 'shape') {
      setSelectedShape(obj);
      setSelectedSticky(null);
      setActivePanel(null);

      setShapePanel({
        strokeColor: obj.stroke || '#000000',
        fillColor: obj.fill === 'transparent' ? '#ffffff' : obj.fill || '#ffffff',
        hasFill: obj.fill !== 'transparent',
      });
    } else if (obj.customType === 'stickyBase' || obj.customType === 'stickyText') {
      setSelectedSticky(obj.stickyId);
      setSelectedShape(null);
      setActivePanel(null);

      const base = canvas.getObjects().find(
        (o) => o.stickyId === obj.stickyId && o.customType === 'stickyBase'
      );

      if (base) {
        setStickyColor(base.fill);
      }
    } else {
      setSelectedShape(null);
      setSelectedSticky(null);
    }
  };

  const applyBrushSettings = (canvas, currentTool, settings) => {
    if (!canvas) return;

    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    canvas.freeDrawingBrush.shadow = null;

    if (settings.mode === 'pen') {
      canvas.freeDrawingBrush.color = settings.color;
      canvas.freeDrawingBrush.width = settings.width;
      return;
    }

    if (settings.mode === 'pencil') {
      canvas.freeDrawingBrush.color = hexToRgba(settings.color, 0.65);
      canvas.freeDrawingBrush.width = settings.width + 1;
      canvas.freeDrawingBrush.shadow = new fabric.Shadow({
        color: hexToRgba(settings.color, 0.22),
        blur: 1.2,
        offsetX: 0,
        offsetY: 0,
      });
      return;
    }

    if (settings.mode === 'highlighter') {
      canvas.freeDrawingBrush.color = hexToRgba(settings.color, 0.22);
      canvas.freeDrawingBrush.width = settings.width + 18;
      canvas.freeDrawingBrush.shadow = null;
    }
  };

  const handleToolClick = (selectedTool) => {
    if (selectedTool === 'pen') {
      setTool('pen');
      setActivePanel(activePanel === 'pen' ? null : 'pen');
      return;
    }

    if (selectedTool === 'text') {
      setTool('select');
      setActivePanel(null);
      setSelectedShape(null);
      setSelectedSticky(null);
      addTextBox();
      return;
    }

    if (selectedTool === 'eraser') {
      setTool('eraser');
      setActivePanel(null);
      setSelectedShape(null);
      setSelectedSticky(null);
      return;
    }

    if (selectedTool === 'ruler') {
      setTool('select');
      setActivePanel(activePanel === 'ruler' ? null : 'ruler');
      setSelectedShape(null);
      setSelectedSticky(null);
      return;
    }

    if (selectedTool === 'sticky') {
      setTool('select');
      setActivePanel(null);
      setSelectedShape(null);
      setSelectedSticky(null);
      addSticky();
    }
  };

  const addTextBox = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const scrollOffset = scrollContainerRef.current ? scrollContainerRef.current.scrollTop : 0;

    const textbox = new fabric.Textbox('Scrie aici...', {
      left: 300,
      top: 200 + scrollOffset,
      width: 250,
      fontSize: 24,
      fill: '#000000',
      fontFamily: 'Zilla Slab',
      backgroundColor: 'transparent',
      padding: 10,
      editable: true,
      selectable: true,
      evented: true,
      customType: 'textBox',
      borderColor: '#344979',
      cornerColor: '#344979',
      cornerSize: 10,
      transparentCorners: false,
    });

    canvas.add(textbox);
    canvas.setActiveObject(textbox);
    canvas.requestRenderAll();

    startEditingTextbox(textbox, 'Scrie aici...');
    saveHistory();
  };

  const addShape = (type) => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    canvas.isDrawingMode = false;
    setTool('select');

    const size = 140;
    const scrollOffset = scrollContainerRef.current ? scrollContainerRef.current.scrollTop : 0;

    const common = {
      left: 240,
      top: 180 + scrollOffset,
      fill: '#ffffff',
      stroke: '#000000',
      strokeWidth: 3,
      selectable: true,
      customType: 'shape',
      borderColor: '#344979',
      cornerColor: '#344979',
      cornerSize: 10,
    };

    let object = null;

    if (type === 'square') {
      object = new fabric.Rect({
        ...common,
        width: size,
        height: size,
      });
    }

    if (type === 'circle') {
      object = new fabric.Circle({
        ...common,
        radius: size / 2,
      });
    }

    if (type === 'triangle') {
      object = new fabric.Triangle({
        ...common,
        width: size,
        height: size,
      });
    }

    if (object) {
      canvas.add(object);
      canvas.setActiveObject(object);

      setSelectedShape(object);
      setShapePanel({
        strokeColor: '#000000',
        fillColor: '#ffffff',
        hasFill: true,
      });

      canvas.requestRenderAll();
      saveHistory();
    }
  };

  const updateSelectedShapeStroke = (color) => {
    const canvas = fabricRef.current;
    if (!canvas || !selectedShape) return;

    selectedShape.set({ stroke: color });

    setShapePanel({
      ...shapePanel,
      strokeColor: color,
    });

    canvas.requestRenderAll();
    saveHistory();
  };

  const updateSelectedShapeFill = (color) => {
    const canvas = fabricRef.current;
    if (!canvas || !selectedShape) return;

    selectedShape.set({ fill: color });

    setShapePanel({
      ...shapePanel,
      fillColor: color,
      hasFill: true,
    });

    canvas.requestRenderAll();
    saveHistory();
  };

  const toggleSelectedShapeFill = () => {
    const canvas = fabricRef.current;
    if (!canvas || !selectedShape) return;

    const nextHasFill = !shapePanel.hasFill;

    selectedShape.set({
      fill: nextHasFill ? shapePanel.fillColor : 'transparent',
    });

    setShapePanel({
      ...shapePanel,
      hasFill: nextHasFill,
    });

    canvas.requestRenderAll();
    saveHistory();
  };

  const addSticky = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    canvas.isDrawingMode = false;

    const stickyId = `sticky-${Date.now()}`;
    const left = 240;
    const scrollOffset = scrollContainerRef.current ? scrollContainerRef.current.scrollTop : 0;
    const top = 180 + scrollOffset;
    const size = 190;
    const fold = 34;

    const note = new fabric.Polygon(
      [
        { x: 0, y: 0 },
        { x: size, y: 0 },
        { x: size, y: size - fold },
        { x: size - fold, y: size },
        { x: 0, y: size },
      ],
      {
        left,
        top,
        fill: stickyBaseColor,
        stroke: '#666',
        strokeWidth: 1.2,
        selectable: true,
        evented: true,
        customType: 'stickyBase',
        stickyId,
        originX: 'left',
        originY: 'top',
      }
    );

    const foldedCorner = new fabric.Polygon(
      [
        { x: 0, y: 0 },
        { x: fold, y: 0 },
        { x: 0, y: fold },
      ],
      {
        left: left + size - fold,
        top: top + size - fold,
        fill: shadeColor(stickyBaseColor, -24),
        stroke: '#666',
        strokeWidth: 1.2,
        selectable: false,
        evented: false,
        customType: 'stickyFold',
        stickyId,
        originX: 'left',
        originY: 'top',
      }
    );

    const text = new fabric.Textbox('Scrie aici...', {
      left: left + 12,
      top: top + 15,
      width: size - 24,
      fontSize: 19,
      fill: stickyTextColor,
      fontFamily: 'Zilla Slab',
      editable: true,
      selectable: true,
      evented: true,
      customType: 'stickyText',
      stickyId,
      borderColor: '#344979',
      cornerColor: '#344979',
      cornerSize: 10,
      backgroundColor: 'transparent',
      originX: 'left',
      originY: 'top',
    });

    initStickyPosition(note);
    initStickyPosition(foldedCorner);
    initStickyPosition(text);

    canvas.add(note);
    canvas.add(foldedCorner);
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.requestRenderAll();

    startEditingTextbox(text, 'Scrie aici...');
    saveHistory();
  };

  const startEditingTextbox = (textbox, placeholder) => {
    setTimeout(() => {
      if (textbox.text === placeholder) {
        textbox.text = '';
      }

      textbox.enterEditing();
      textbox.selectAll();

      if (textbox.hiddenTextarea) {
        textbox.hiddenTextarea.focus();
      }

      fabricRef.current?.requestRenderAll();
    }, 100);
  };

  const initStickyPosition = (obj) => {
    obj.__lastLeft = obj.left;
    obj.__lastTop = obj.top;
  };

  const keepStickyTogether = (e) => {
    const canvas = fabricRef.current;
    const obj = e.target;

    if (!canvas || !obj || !obj.stickyId) return;

    const previousLeft = obj.__lastLeft ?? obj.left;
    const previousTop = obj.__lastTop ?? obj.top;

    const dx = obj.left - previousLeft;
    const dy = obj.top - previousTop;

    if (dx === 0 && dy === 0) return;

    const companions = canvas
      .getObjects()
      .filter((item) => item.stickyId === obj.stickyId && item !== obj);

    companions.forEach((item) => {
      item.left += dx;
      item.top += dy;
      item.__lastLeft = item.left;
      item.__lastTop = item.top;
      item.setCoords();
    });

    obj.__lastLeft = obj.left;
    obj.__lastTop = obj.top;
    obj.setCoords();

    canvas.requestRenderAll();
  };

  const removeStickyById = (stickyId) => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const stickyObjects = canvas.getObjects().filter((obj) => obj.stickyId === stickyId);
    stickyObjects.forEach((obj) => canvas.remove(obj));
  };

  const handleCanvasDoubleClick = (e) => {
    const target = e.target;
    if (!target) return;

    if (target.customType === 'stickyText') {
      if (target.text === 'Scrie aici...') {
        target.text = '';
      }

      target.enterEditing();
      target.hiddenTextarea?.focus();
      fabricRef.current?.requestRenderAll();
      return;
    }

    if (target.customType === 'textBox') {
      if (target.text === 'Scrie aici...') {
        target.text = '';
      }

      target.enterEditing();
      target.hiddenTextarea?.focus();
      fabricRef.current?.requestRenderAll();
      return;
    }
  };

  const changeStickyColorDirect = (stickyId, color) => {
    const canvas = fabricRef.current;

    if (!canvas || !stickyId) return;

    canvas.getObjects().forEach((obj) => {
      if (obj.stickyId !== stickyId) return;

      if (obj.customType === 'stickyBase') {
        obj.set({ fill: color });
      }

      if (obj.customType === 'stickyFold') {
        if (obj.type === 'polygon') {
          obj.set({ fill: shadeColor(color, -24) });
        }
      }
    });

    canvas.requestRenderAll();
    saveHistory();
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadedFileName(file.name);

    const extension = file.name.split('.').pop().toLowerCase();

    if (extension === 'pdf') {
      setUploadedFileType('pdf');
      await renderPdfInsideEditor(file);
      return;
    }

    if (extension === 'ppt' || extension === 'pptx') {
      setUploadedFileType('ppt');
      setSaveStatus('PPT încărcat');
      setTimeout(() => setSaveStatus(''), 1800);
      return;
    }

    setSaveStatus('Fișier invalid');
  };

  const stergePdfVechi = (canvas) => {
    if (!canvas) return;

    const objects = canvas.getObjects();

    const pdfObjects = objects.filter((obj) => {
      const customType = obj.customType || '';
      const fileType = obj.fileType || '';
      const fileName = obj.fileName || '';
      const objectType = String(obj.type || '').toLowerCase();

      const width = (obj.width || 0) * (obj.scaleX || 1);
      const height = (obj.height || 0) * (obj.scaleY || 1);

      const estePdfMarcat =
        customType === 'pdfPage' ||
        customType === 'pdfBackground' ||
        fileType === 'pdf' ||
        fileName.toLowerCase().endsWith('.pdf');

      const esteImagineMare =
        objectType.includes('image') &&
        width > 300 &&
        height > 300 &&
        !obj.stickyId &&
        customType !== 'stickyBase' &&
        customType !== 'stickyText' &&
        customType !== 'shape' &&
        customType !== 'textBox';

      const esteDreptunghiMareAlb =
        objectType.includes('rect') &&
        width > 300 &&
        height > 300 &&
        (
          obj.fill === '#ffffff' ||
          obj.fill === 'white' ||
          obj.fill === 'rgb(255,255,255)' ||
          obj.fill === 'rgb(255, 255, 255)'
        ) &&
        customType !== 'shape' &&
        !obj.stickyId;

      return estePdfMarcat || esteImagineMare || esteDreptunghiMareAlb;
    });

    pdfObjects.forEach((obj) => {
      canvas.remove(obj);
    });

    canvas.discardActiveObject();
    canvas.requestRenderAll();
  };

  const loadPdfFromUrl = async (url) => {
    const canvas = fabricRef.current;
    if (!canvas || !scrollContainerRef.current) return;

    try {
      setSaveStatus('Generare poze PDF...');
      const pdfjsLib = await loadPdfJs();
      const pdf = await pdfjsLib.getDocument({ url }).promise;
      
      stergePdfVechi(canvas);

      const visibleWidth = scrollContainerRef.current.clientWidth;

      const targetPageWidth = Math.max(
        620,
        Math.min(820, visibleWidth - 360)
      );

      const pageGap = 44;
      let currentTop = TOP_EDITOR_HEIGHT + 44 + 48;

      const createdObjects = [];

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        setSaveStatus(`Se încarcă PDF... ${pageNumber}/${pdf.numPages}`);
        const page = await pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale: 2 });
        const tempCanvas = document.createElement('canvas');
        const context = tempCanvas.getContext('2d', { alpha: false });
        tempCanvas.width = viewport.width;
        tempCanvas.height = viewport.height;
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        await page.render({ canvasContext: context, viewport }).promise;
        const imageUrl = tempCanvas.toDataURL('image/png');
        
        const htmlImage = new Image();
        htmlImage.src = imageUrl;
        await new Promise((resolve, reject) => {
          htmlImage.onload = resolve;
          htmlImage.onerror = reject;
        });

        const pageImage = new fabric.Image(htmlImage, {
          selectable: false, evented: false, customType: 'pdfPage', fileType: 'pdf', pageNumber, originX: 'left', originY: 'top', objectCaching: false,
        });

        const scale = targetPageWidth / pageImage.width;
        const renderedWidth = pageImage.width * scale;
        const renderedHeight = pageImage.height * scale;
        const left = Math.round((visibleWidth - renderedWidth) / 2);

        const pageBg = new fabric.Rect({
          left, top: currentTop, width: renderedWidth, height: renderedHeight, fill: '#ffffff', selectable: false, evented: false, customType: 'pdfBackground', fileType: 'pdf', pageNumber, originX: 'left', originY: 'top',
          shadow: new fabric.Shadow({ color: 'rgba(0,0,0,0.26)', blur: 16, offsetX: 0, offsetY: 5 }),
        });

        pageImage.set({ left, top: currentTop, scaleX: scale, scaleY: scale });

        createdObjects.push(pageBg, pageImage);
        currentTop += renderedHeight + pageGap;
      }

      const nextHeight = Math.max(CANVAS_HEIGHT, currentTop + 180);
      canvasHeightRef.current = nextHeight;
      setCanvasHeight(nextHeight);
      canvas.setDimensions({ width: visibleWidth, height: nextHeight });

      createdObjects.forEach((obj) => canvas.add(obj));
      createdObjects.forEach((obj) => { if (obj.customType === 'pdfBackground') canvas.sendObjectToBack(obj); });
      createdObjects.forEach((obj) => { if (obj.customType === 'pdfPage') canvas.bringObjectForward(obj); });

      canvas.requestRenderAll();
      setSaveStatus(`PDF încărcat: ${pdf.numPages} pagini. Apasă Salvează.`);
      setTimeout(() => setSaveStatus(''), 3000);
    } catch(err) {
      console.error('Eroare randare PDF din URL:', err);
      setSaveStatus(`Eroare randare PDF`);
    }
  };

  const renderPdfInsideEditor = async (file) => {
    const canvas = fabricRef.current;
    if (!canvas || !scrollContainerRef.current) return;

    try {
      setSaveStatus('Se încarcă PDF...');

      // upload pdf la cloudinary pt URL permanent
      let secureUrl = null;
      try {
        const formData = new FormData();
        formData.append('file', file);
        const uploadRes = await fetch(`${API_URL_MATERIALS}/upload-pdf`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData,
        });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          secureUrl = uploadData.url || null;
        } else {
          const errData = await uploadRes.json().catch(() => ({}));
          console.warn('Upload PDF eșuat:', uploadRes.status, errData.message);
        }
      } catch (uploadErr) {
        console.warn('Eroare la upload PDF:', uploadErr);
      }

      // salvam URL-ul in state si pe canvas 
      if (secureUrl) {
        setNativePdfUrl(secureUrl);
        canvas.nativePdfUrl = secureUrl;
      }

      // randam paginile PDF local cu pdfjs
      const pdfjsLib = await loadPdfJs();
      const arrayBuffer = await file.arrayBuffer();

      const pdf = await pdfjsLib.getDocument({
        data: arrayBuffer,
      }).promise;

      // extragem textul din fiecare pagina
      const pdfTextContent = [];
      for (let pn = 1; pn <= pdf.numPages; pn++) {
        try {
          const page = await pdf.getPage(pn);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item) => ('str' in item ? item.str : ''))
            .join(' ');
          pdfTextContent.push({ page: pn, text: pageText });
        } catch (_) {
          pdfTextContent.push({ page: pn, text: '' });
        }
      }
      canvas.pdfTextContent = pdfTextContent;

      // randam vizual paginile pe canvas ca imagini
      isRestoringRef.current = true;
      stergePdfVechi(canvas);

      const visibleWidth = scrollContainerRef.current.clientWidth;
      const targetPageWidth = Math.max(620, Math.min(820, visibleWidth - 360));
      const pageGap = 44;
      let currentTop = TOP_EDITOR_HEIGHT + 44 + 48;
      const createdObjects = [];

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        setSaveStatus(`Se randează pagina ${pageNumber}/${pdf.numPages}...`);

        const page = await pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale: 2 });

        const tempCanvas = document.createElement('canvas');
        const context = tempCanvas.getContext('2d', { alpha: false });
        tempCanvas.width = viewport.width;
        tempCanvas.height = viewport.height;

        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

        await page.render({ canvasContext: context, viewport }).promise;

        const imageUrl = tempCanvas.toDataURL('image/jpeg', 0.85);

        const htmlImage = new Image();
        htmlImage.src = imageUrl;
        await new Promise((resolve, reject) => {
          htmlImage.onload = resolve;
          htmlImage.onerror = reject;
        });

        const pageImage = new fabric.Image(htmlImage, {
          selectable: false,
          evented: false,
          customType: 'pdfPage',
          fileName: file.name,
          fileType: 'pdf',
          pageNumber,
          originX: 'left',
          originY: 'top',
          objectCaching: false,
        });

        const scale = targetPageWidth / pageImage.width;
        const renderedWidth = pageImage.width * scale;
        const renderedHeight = pageImage.height * scale;
        const left = Math.round((visibleWidth - renderedWidth) / 2);

        const pageBg = new fabric.Rect({
          left,
          top: currentTop,
          width: renderedWidth,
          height: renderedHeight,
          fill: '#ffffff',
          selectable: false,
          evented: false,
          customType: 'pdfBackground',
          fileName: file.name,
          fileType: 'pdf',
          pageNumber,
          originX: 'left',
          originY: 'top',
          shadow: new fabric.Shadow({ color: 'rgba(0,0,0,0.26)', blur: 16, offsetX: 0, offsetY: 5 }),
        });

        pageImage.set({ left, top: currentTop, scaleX: scale, scaleY: scale });
        createdObjects.push(pageBg, pageImage);
        currentTop += renderedHeight + pageGap;
      }

      const nextHeight = Math.max(CANVAS_HEIGHT, currentTop + 180);
      canvasHeightRef.current = nextHeight;
      setCanvasHeight(nextHeight);
      canvas.setDimensions({ width: visibleWidth, height: nextHeight });

      createdObjects.forEach((obj) => canvas.add(obj));
      createdObjects
        .filter((obj) => obj.customType === 'pdfBackground')
        .forEach((obj) => canvas.sendObjectToBack(obj));
      createdObjects
        .filter((obj) => obj.customType === 'pdfPage')
        .forEach((obj) => canvas.bringObjectForward(obj));

      canvas.requestRenderAll();

      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
        scrollContainerRef.current.scrollLeft = 0;
      }

      isRestoringRef.current = false;

      // salvam imediat în backend
      await salveazaCanvasInBackend();

      const msg = secureUrl
        ? `PDF salvat (${pdf.numPages} pagini)`
        : `PDF afișat (${pdf.numPages} pagini) — nu s-a putut salva online`;
      setSaveStatus(msg);
      setTimeout(() => setSaveStatus(''), 4000);
    } catch (err) {
      console.error('Eroare PDF:', err);
      isRestoringRef.current = false;
      setSaveStatus('Eroare la încărcarea PDF');
    }
  };

  const getPaperBackground = () => {
    if (uploadedFileType === 'pdf') {
      return {
        backgroundColor: '#2a3a65',
        backgroundImage: 'none',
      };
    }

    if (paperType === 'math') {
      return {
        backgroundColor: '#c6c6e8',
        backgroundImage:
          'linear-gradient(rgba(52,73,121,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(52,73,121,0.18) 1px, transparent 1px)',
        backgroundSize: '26px 26px',
      };
    }

    if (paperType === 'lined') {
      return {
        backgroundColor: '#c6c6e8',
        backgroundImage:
          'repeating-linear-gradient(to bottom, transparent 0px, transparent 29px, rgba(52,73,121,0.34) 30px)',
        backgroundSize: '100% 30px',
      };
    }

    return {
      backgroundColor: '#c6c6e8',
      backgroundImage: 'none',
    };
  };

  const renderPaperPreview = () => {
    if (paperType === 'math') {
      return <div style={paperPreviewMathStyle}></div>;
    }

    if (paperType === 'lined') {
      return (
        <div style={paperPreviewLinedWrapper}>
          <span style={paperPreviewLine}></span>
          <span style={paperPreviewLine}></span>
          <span style={paperPreviewLine}></span>
        </div>
      );
    }

    return <div style={paperPreviewBlankStyle}></div>;
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: `${sidebarWidth}px`,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: `${TOP_EDITOR_HEIGHT}px`,
          opacity: 1,
          pointerEvents: 'auto',
          transition: 'opacity 0.12s linear',
          background: `linear-gradient(135deg, #344979, #5d6da5)`,
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: '20px',
          paddingRight: '16px',
          borderBottom: `1.5px solid rgba(198,198,232,0.25)`,
          boxShadow: '0 2px 12px rgba(52,73,121,0.3)',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
          
          <input 
            value={numeMaterie === 'Se încarcă...' ? '' : numeMaterie}
            onChange={(e) => setNumeMaterie(e.target.value)}
            onBlur={salveazaCanvasInBackend}
            placeholder="Nume notiță..."
            style={{ 
              background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.4)', 
              color: '#ffffff', fontSize: '17px', fontWeight: 800, fontFamily: "'Zilla Slab', serif", 
              outline: 'none', width: '220px', letterSpacing: '0.3px' 
            }} 
          />

          <div style={{ width: '1.5px', height: '20px', backgroundColor: 'rgba(198,198,232,0.35)', flexShrink: 0 }} />

          <div
            onClick={() => fileInputRef.current.click()}
            style={{
              display: 'flex', alignItems: 'center', cursor: 'pointer',
              gap: '6px', userSelect: 'none', flexShrink: 0,
              background: 'rgba(255,255,255,0.12)', borderRadius: '50px',
              padding: '5px 14px 5px 10px', border: '1.5px solid rgba(255,255,255,0.2)',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
          >
            <span style={{ fontSize: '18px', lineHeight: 1, fontWeight: 700 }}>+</span>
            <span style={{ fontSize: '13px', fontWeight: 700, fontFamily: "'Zilla Slab', serif" }}>
              {uploadedFileName ? uploadedFileName : 'Încarcă fișier'}
            </span>
            <input ref={fileInputRef} type="file" accept=".pdf,.ppt,.pptx" style={{ display: 'none' }} onChange={handleFileUpload} />
          </div>

          {uploadedFileName && (
            <span style={{ fontSize: '11px', color: 'rgba(198,198,232,0.8)', fontWeight: 600, background: 'rgba(0,0,0,0.15)', borderRadius: '50px', padding: '2px 10px', flexShrink: 0 }}>
              {uploadedFileType?.toUpperCase()}
            </span>
          )}
        </div>

        
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
          {saveStatus && (
            <span style={{ color: 'rgba(198,198,232,0.9)', fontSize: '12px', fontWeight: 600, fontFamily: "'Zilla Slab', serif", whiteSpace: 'nowrap' }}>
              {saveStatus}
            </span>
          )}

          <button type="button" onClick={undo} style={topIconButtonStyle} title="Undo (Ctrl+Z)">↶</button>
          <button type="button" onClick={redo} style={topIconButtonStyle} title="Redo (Ctrl+Y)">↷</button>

          <div style={{ width: '1.5px', height: '20px', backgroundColor: 'rgba(198,198,232,0.3)' }} />

          <button type="button" onClick={salveazaCanvasInBackend} style={saveButtonStyle} title="Salvează">
            Salvează
          </button>
        </div>
      </div>

      {activePanel === 'pen' && (
        <div style={floatingPanelStyle}>
          <input
            type="color"
            value={penSettings.color}
            onChange={(e) =>
              setPenSettings({
                ...penSettings,
                color: e.target.value,
              })
            }
            style={colorRectangleStyle}
          />

          <div style={modeButtonsRowStyle}>
            <button
              type="button"
              onClick={() =>
                setPenSettings({
                  ...penSettings,
                  mode: 'pen',
                })
              }
              style={miniModeButtonStyle(penSettings.mode === 'pen')}
              title="Pix"
            >
              <img src={pixIcon} alt="Pix" style={miniModeIconStyle} />
            </button>

            <button
              type="button"
              onClick={() =>
                setPenSettings({
                  ...penSettings,
                  mode: 'pencil',
                })
              }
              style={miniModeButtonStyle(penSettings.mode === 'pencil')}
              title="Creion"
            >
              <img src={creionIcon} alt="Creion" style={miniModeIconStyle} />
            </button>

            <button
              type="button"
              onClick={() =>
                setPenSettings({
                  ...penSettings,
                  mode: 'highlighter',
                })
              }
              style={miniModeButtonStyle(penSettings.mode === 'highlighter')}
              title="Highlighter"
            >
              <img src={highlighterIcon} alt="Highlighter" style={miniModeIconStyle} />
            </button>
          </div>

          <input
            type="range"
            min="1"
            max="35"
            value={penSettings.width}
            onChange={(e) =>
              setPenSettings({
                ...penSettings,
                width: Number(e.target.value),
              })
            }
            style={{ width: '100%' }}
          />
        </div>
      )}

      {activePanel === 'ruler' && (
        <div style={{ ...floatingPanelStyle, width: 'auto' }}>
          <div style={shapeRowStyle}>
            <button
              type="button"
              style={iconOnlyPanelButton}
              onClick={() => addShape('square')}
              title="Pătrat"
            >
              ▢
            </button>

            <button
              type="button"
              style={{ ...iconOnlyPanelButton, fontSize: '48px', paddingBottom: '4px' }}
              onClick={() => addShape('circle')}
              title="Cerc"
            >
              ○
            </button>

            <button
              type="button"
              style={iconOnlyPanelButton}
              onClick={() => addShape('triangle')}
              title="Triunghi"
            >
              △
            </button>
          </div>
        </div>
      )}

      {selectedSticky && (
        <div style={shapeEditPanelStyle}>
          <span style={{ fontSize: '15px', fontWeight: 600, color: '#344979' }}>
            Alege culoarea
          </span>
          <input
            type="color"
            value={stickyColor}
            onChange={(e) => {
              setStickyColor(e.target.value);
              changeStickyColorDirect(selectedSticky, e.target.value);
            }}
            onClick={(e) => e.target.blur()}
            style={colorRectangleStyle}
            title="Schimbă culoarea biletului"
          />
        </div>
      )}

      {selectedShape && (
        <div style={shapeEditPanelStyle}>
          <span style={{ fontSize: '15px', fontWeight: 600, color: '#344979' }}>
            Culoare contur
          </span>
          <input
            type="color"
            value={shapePanel.strokeColor}
            onChange={(e) => updateSelectedShapeStroke(e.target.value)}
            onClick={(e) => e.target.blur()}
            style={colorRectangleStyle}
            title="Culoare contur"
          />

          <span style={{ fontSize: '15px', fontWeight: 600, color: '#344979' }}>
            Culoare interior
          </span>
          <input
            type="color"
            value={shapePanel.fillColor}
            onChange={(e) => updateSelectedShapeFill(e.target.value)}
            onClick={(e) => e.target.blur()}
            style={colorRectangleStyle}
            title="Culoare interior"
          />

          <button
            type="button"
            onClick={toggleSelectedShapeFill}
            style={fillButtonStyle(shapePanel.hasFill)}
            title="Fill"
          >
            Fill
          </button>
        </div>
      )}

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', paddingTop: `${TOP_EDITOR_HEIGHT}px`, background: `linear-gradient(135deg, #344979, #5d6da5)` }}>
        <div
          style={{
            width: `${LEFT_BAR_WIDTH}px`,
            backgroundColor: '#c6c6e8',
            borderRight: `1.5px solid rgba(52,73,121,0.2)`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: '16px',
            gap: '8px',
            flexShrink: 0,
            overflowY: 'auto',
          }}
        >
          <div style={{ position: 'relative', marginBottom: '8px' }}>
            <select
              value={paperType}
              onChange={(e) => setPaperType(e.target.value)}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: 0,
                width: '54px',
                height: '54px',
                cursor: 'pointer',
              }}
              title="Tipul paginii"
            >
              <option value="blank">Foaie goală</option>
              <option value="math">Foaie de mate</option>
              <option value="lined">Foaie cu linii</option>
            </select>

            <div style={paperPreviewBoxStyle}>{renderPaperPreview()}</div>
          </div>

          <button
            type="button"
            onClick={() => handleToolClick('text')}
            title="Text"
            style={toolButtonStyle(tool === 'text')}
          >
            <img src={textIcon} alt="Text" style={textToolIconStyle} />
          </button>

          <button
            type="button"
            onClick={() => handleToolClick('pen')}
            title="Creion"
            style={toolButtonStyle(tool === 'pen')}
          >
            <img src={creionIcon} alt="Creion" style={toolIconStyle} />
          </button>

          <button
            type="button"
            onClick={() => handleToolClick('eraser')}
            title="Radieră"
            style={toolButtonStyle(tool === 'eraser')}
          >
            <img src={gumaIcon} alt="Radieră" style={toolIconStyle} />
          </button>

          <button
            type="button"
            onClick={() => handleToolClick('ruler')}
            title="Forme"
            style={toolButtonStyle(activePanel === 'ruler')}
          >
            <span style={{ fontSize: '40px', color: '#344979' }}>△</span>
          </button>

          <button
            type="button"
            onClick={() => handleToolClick('sticky')}
            title="Sticky note"
            style={toolButtonStyle(false)}
          >
            <img src={stickyIcon} alt="Sticky note" style={{ ...toolIconStyle, marginLeft: '-8px' }} />
          </button>
        </div>

        <div
          style={{
            flex: 1,
            display: 'flex',
            overflow: 'hidden',
          }}
          onClick={() => {
            if (document.activeElement) document.activeElement.blur();
          }}
        >


          <div
            ref={scrollContainerRef}
            style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', position: 'relative' }}
          >
            <div
              ref={boardRef}
              style={{
                width: '100%',
                height: `${canvasHeight}px`,
                position: 'relative',
                ...getPaperBackground(),
              }}
            >
              <canvas ref={canvasRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const toolButtonStyle = (active) => ({
  width: '64px',
  height: '64px',
  padding: 0,
  border: active ? '2px solid #344979' : 'none',
  borderRadius: '10px',
  backgroundColor: active ? 'rgba(93,109,165,0.25)' : 'transparent',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const toolIconStyle = {
  width: '52px',
  height: '52px',
  objectFit: 'contain',
  pointerEvents: 'none',
};

const textToolIconStyle = {
  width: '58px',
  height: '58px',
  objectFit: 'contain',
  pointerEvents: 'none',
};

const floatingPanelStyle = {
  position: 'absolute',
  left: '126px',
  top: '150px',
  width: '270px',
  backgroundColor: '#f7e5eb',
  border: `2px solid #c6c6e8`,
  borderRadius: '16px',
  padding: '14px',
  zIndex: 20,
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  boxShadow: '0 8px 24px rgba(52,73,121,0.18)',
};

const shapeEditPanelStyle = {
  position: 'absolute',
  left: '126px',
  top: '150px',
  width: '210px',
  backgroundColor: '#f7e5eb',
  border: `2px solid #c6c6e8`,
  borderRadius: '16px',
  padding: '14px',
  zIndex: 25,
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  boxShadow: '0 8px 24px rgba(52,73,121,0.18)',
};

const colorRectangleStyle = {
  width: '100%',
  height: '42px',
  border: `1px solid #9896bb`,
  borderRadius: '8px',
  background: 'transparent',
  cursor: 'pointer',
};

const modeButtonsRowStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '10px',
};

const shapeRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '10px',
};

const miniModeButtonStyle = (active) => ({
  width: '52px',
  height: '52px',
  borderRadius: '10px',
  border: active ? `2px solid #344979` : `1px solid #c6c6e8`,
  backgroundColor: active ? 'rgba(198,198,232,0.5)' : '#ffffff',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
});

const miniModeIconStyle = {
  width: '36px',
  height: '36px',
  objectFit: 'contain',
  pointerEvents: 'none',
};

const iconOnlyPanelButton = {
  width: '72px',
  height: '58px',
  borderRadius: '10px',
  border: `1px solid #9896bb`,
  backgroundColor: '#ffffff',
  fontSize: '34px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const fillButtonStyle = (active) => ({
  width: '100%',
  height: '42px',
  borderRadius: '10px',
  border: active ? `2px solid #344979` : `1px solid #9896bb`,
  backgroundColor: active ? 'rgba(198,198,232,0.4)' : '#ffffff',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: 700,
  color: '#344979',
  fontFamily: "'Zilla Slab', serif",
});

const saveButtonStyle = {
  height: '32px',
  padding: '0 16px',
  borderRadius: '50px',
  border: '1.5px solid rgba(255,255,255,0.7)',
  background: 'rgba(255,255,255,0.15)',
  color: '#ffffff',
  cursor: 'pointer',
  fontSize: '13px',
  fontWeight: 800,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: "'Zilla Slab', serif",
  letterSpacing: '0.5px',
  transition: 'background 0.15s',
};

const topIconButtonStyle = {
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  border: '1.5px solid rgba(255,255,255,0.35)',
  backgroundColor: 'rgba(255,255,255,0.08)',
  color: '#ffffff',
  cursor: 'pointer',
  fontSize: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const paperPreviewBoxStyle = {
  width: '54px',
  height: '54px',
  borderRadius: '10px',
  border: `2px solid #344979`,
  backgroundColor: 'rgba(255,255,255,0.9)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  cursor: 'pointer',
};

const paperPreviewBlankStyle = {
  width: '38px',
  height: '42px',
  border: `2px solid #5d6da5`,
  borderRadius: '4px',
  backgroundColor: '#ffffff',
};

const paperPreviewMathStyle = {
  width: '38px',
  height: '42px',
  border: `2px solid #5d6da5`,
  borderRadius: '4px',
  backgroundColor: '#ffffff',
  backgroundImage:
    'linear-gradient(rgba(52,73,121,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(52,73,121,0.25) 1px, transparent 1px)',
  backgroundSize: '8px 8px',
};

const paperPreviewLinedWrapper = {
  width: '38px',
  height: '42px',
  border: `2px solid #5d6da5`,
  borderRadius: '4px',
  backgroundColor: '#ffffff',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: '6px',
  paddingLeft: '5px',
  paddingRight: '5px',
};

const paperPreviewLine = {
  width: '100%',
  height: '2px',
  backgroundColor: '#5d6da5',
};

const fileBarStyle = {
  minHeight: '44px',
  backgroundColor: '#5d6da5',
  color: '#ffffff',
  borderBottom: `2px solid rgba(52,73,121,0.3)`,
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  paddingLeft: '28px',
  paddingRight: '28px',
  fontSize: '16px',
  fontWeight: 500,
  flexShrink: 0,
  fontFamily: "'Zilla Slab', serif",
};

function hexToRgba(hex, alpha) {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function shadeColor(hex, percent) {
  const cleanHex = hex.replace('#', '');
  const num = parseInt(cleanHex, 16);

  let r = (num >> 16) + percent;
  let g = ((num >> 8) & 0x00ff) + percent;
  let b = (num & 0x0000ff) + percent;

  r = Math.max(Math.min(255, r), 0);
  g = Math.max(Math.min(255, g), 0);
  b = Math.max(Math.min(255, b), 0);

  return `rgb(${r}, ${g}, ${b})`;
}

export default PaginaEditMateriale;