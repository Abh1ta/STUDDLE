import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import { useParams } from 'react-router-dom';

import creionIcon from '../assets/creion.png';
import gumaIcon from '../assets/gumasters.png';
import stickyIcon from '../assets/stuckynote.png';
import textIcon from '../assets/icontext.png';

import pixIcon from '../assets/pix.png';
import highlighterIcon from '../assets/highlighter.png';

function PaginaEditMateriale() {
  const params = useParams();
  const numeMaterie = Object.values(params)[0] || 'Materie';

  const canvasRef = useRef(null);
  const boardRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const fabricRef = useRef(null);
  const fileInputRef = useRef(null);
  const stickyColorInputRef = useRef(null);

  const activeStickyIdRef = useRef(null);
  const undoStackRef = useRef([]);
  const redoStackRef = useRef([]);
  const isRestoringRef = useRef(false);

  const [tool, setTool] = useState('pen');
  const [activePanel, setActivePanel] = useState(null);
  const [paperType, setPaperType] = useState('blank');

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

  const stickyBaseColor = '#fff4a8';
  const stickyTextColor = '#000000';

  const LEFT_BAR_WIDTH = 112;
  const TOP_EDITOR_HEIGHT = 135;
  const CANVAS_HEIGHT = 6000;

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

    resizeCanvasToBoard(canvas);
    applyBrushSettings(canvas, 'pen', penSettings);
    saveHistory();

    const resizeObserver = new ResizeObserver(() => {
      if (!boardRef.current || !fabricRef.current) return;
      fabricRef.current.setDimensions({
        width: scrollContainerRef.current.clientWidth,
        height: CANVAS_HEIGHT,
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
      }
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

      if (e.key !== 'Delete' && e.key !== 'Backspace') return;

      const activeObject = canvas.getActiveObject();
      if (!activeObject) return;
      if (activeObject.isEditing) return;

      const activeObjects = canvas.getActiveObjects();

      activeObjects.forEach((obj) => {
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

      canvas.off('object:added', saveHistory);
      canvas.off('object:modified', saveHistory);
      canvas.off('object:removed', saveHistory);

      canvas.off('selection:created', handleSelection);
      canvas.off('selection:updated', handleSelection);
      canvas.off('selection:cleared');

      canvas.off('object:moving', keepStickyTogether);
      canvas.off('mouse:dblclick', handleCanvasDoubleClick);

      window.removeEventListener('keydown', handleKeyDown);

      canvas.dispose();
      fabricRef.current = null;
    };
  }, []);

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

          if (obj.intersectsWithObject(eraserCursor) || obj.containsPoint(pointer)) {
            if (obj.stickyId) continue;
            canvas.remove(obj);
            removedSomething = true;
          }
        }
        return removedSomething;
      };

      canvas.on('mouse:down', (e) => {
        isErasing = true;
        const pointer = canvas.getPointer(e.e);
        eraserCursor.set({ left: pointer.x, top: pointer.y, opacity: 1 });
        eraserCursor.setCoords();

        performErase(pointer);
        canvas.requestRenderAll();
      });

      canvas.on('mouse:move', (e) => {
        const pointer = canvas.getPointer(e.e);
        eraserCursor.set({ left: pointer.x, top: pointer.y, opacity: 1 });
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
    }

    canvas.requestRenderAll();
  }, [tool, penSettings]);

  const resizeCanvasToBoard = (canvas) => {
    if (!scrollContainerRef.current || !canvas) return;

    canvas.setDimensions({
      width: scrollContainerRef.current.clientWidth,
      height: CANVAS_HEIGHT,
    });

    canvas.requestRenderAll();
  };

  const saveHistory = () => {
    const canvas = fabricRef.current;
    if (!canvas || isRestoringRef.current) return;

    isRestoringRef.current = true;

    const cursors = canvas.getObjects().filter((o) => o.customType === 'eraserCursor');
    cursors.forEach((c) => canvas.remove(c));

    const json = canvas.toJSON(['customType', 'stickyId']);
    undoStackRef.current.push(json);

    if (undoStackRef.current.length > 60) {
      undoStackRef.current.shift();
    }

    redoStackRef.current = [];

    cursors.forEach((c) => canvas.add(c));
    isRestoringRef.current = false;
  };

  const restoreCanvas = async (json) => {
    const canvas = fabricRef.current;
    if (!canvas || !json) return;

    isRestoringRef.current = true;

    const result = canvas.loadFromJSON(json);
    if (result && typeof result.then === 'function') {
      await result;
    }

    canvas.requestRenderAll();
    isRestoringRef.current = false;
  };

  const undo = async () => {
    if (undoStackRef.current.length <= 1) return;

    const current = undoStackRef.current.pop();
    redoStackRef.current.push(current);

    const previous = undoStackRef.current[undoStackRef.current.length - 1];
    await restoreCanvas(previous);
  };

  const redo = async () => {
    if (redoStackRef.current.length === 0) return;

    const next = redoStackRef.current.pop();
    undoStackRef.current.push(next);

    await restoreCanvas(next);
  };

  const handleSelection = (e) => {
    const obj = e.selected?.[0];
    const canvas = fabricRef.current;

    if (!obj) {
      setSelectedShape(null);
      setSelectedSticky(null);
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
      borderColor: '#3c345f',
      cornerColor: '#3c345f',
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
      borderColor: '#3c345f',
      cornerColor: '#3c345f',
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
      borderColor: '#3c345f',
      cornerColor: '#3c345f',
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

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log('Fișier selectat:', file);
  };

  const getPaperBackground = () => {
    if (paperType === 'math') {
      return {
        backgroundColor: '#cbc4d9',
        backgroundImage:
          'linear-gradient(rgba(78, 64, 110, 0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(78, 64, 110, 0.18) 1px, transparent 1px)',
        backgroundSize: '26px 26px',
      };
    }

    if (paperType === 'lined') {
      return {
        backgroundColor: '#cbc4d9',
        backgroundImage:
          'repeating-linear-gradient(to bottom, transparent 0px, transparent 29px, rgba(78, 64, 110, 0.34) 30px)',
        backgroundSize: '100% 30px',
      };
    }

    return {
      backgroundColor: '#cbc4d9',
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
        width: '100vw',
        height: 'calc(100vh - 80px)',
        backgroundColor: '#3c345f',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <div
        style={{
          height: `${TOP_EDITOR_HEIGHT}px`,
          backgroundColor: '#3c345f',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: '28px',
          paddingRight: '28px',
          borderBottom: '2px solid #1f1f1f',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ fontSize: '26px', fontWeight: 'bold', textTransform: 'capitalize' }}>
            {numeMaterie}
          </div>

          <div style={{ width: '2px', height: '36px', backgroundColor: '#1f1f1f' }}></div>

          <div
            onClick={() => fileInputRef.current.click()}
            style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              gap: '8px',
              userSelect: 'none',
              fontSize: '20px',
              fontWeight: 500,
            }}
          >
            <span
              style={{
                width: '32px',
                height: '32px',
                border: '3px solid #ffffff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                lineHeight: '28px',
              }}
            >
              +
            </span>
            <span>Încarcă un fișier</span>
            <input
              ref={fileInputRef}
              type="file"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button type="button" onClick={undo} style={topIconButtonStyle} title="Undo (Ctrl+Z)">
            ↶
          </button>
          <button type="button" onClick={redo} style={topIconButtonStyle} title="Redo">
            ↷
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
          <span style={{ fontSize: '15px', fontWeight: 600, color: '#3c345f' }}>
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
          <span style={{ fontSize: '15px', fontWeight: 600, color: '#3c345f' }}>
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

          <span style={{ fontSize: '15px', fontWeight: 600, color: '#3c345f' }}>
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

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div
          style={{
            width: `${LEFT_BAR_WIDTH}px`,
            backgroundColor: '#c9d1ec',
            borderRight: '1.5px solid #1f1f1f',
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
            <span style={{ fontSize: '40px', color: '#3c345f' }}>△</span>
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
          ref={scrollContainerRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
          onClick={() => {
            if (document.activeElement) document.activeElement.blur();
          }}
        >
          <div
            ref={boardRef}
            style={{
              width: '100%',
              height: `${CANVAS_HEIGHT}px`,
              position: 'relative',
              ...getPaperBackground(),
            }}
          >
            <canvas ref={canvasRef} />
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
  border: active ? '2px solid #3c345f' : 'none',
  borderRadius: '10px',
  backgroundColor: active ? '#b8c2e5' : 'transparent',
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
  backgroundColor: '#f1eff8',
  border: '2px solid #3c345f',
  borderRadius: '12px',
  padding: '14px',
  zIndex: 20,
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  boxShadow: '0 8px 18px rgba(0,0,0,0.25)',
};

const shapeEditPanelStyle = {
  position: 'absolute',
  left: '126px',
  top: '150px',
  width: '210px',
  backgroundColor: '#f1eff8',
  border: '2px solid #3c345f',
  borderRadius: '12px',
  padding: '14px',
  zIndex: 25,
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  boxShadow: '0 8px 18px rgba(0,0,0,0.25)',
};

const colorRectangleStyle = {
  width: '100%',
  height: '42px',
  border: '1px solid #8e86a8',
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
  border: active ? '2px solid #3c345f' : '1px solid #b9b4cb',
  backgroundColor: active ? '#d9d4ea' : '#ffffff',
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
  border: '1px solid #999',
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
  border: active ? '2px solid #3c345f' : '1px solid #999',
  backgroundColor: active ? '#d9d4ea' : '#ffffff',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: 700,
});

const topIconButtonStyle = {
  width: '38px',
  height: '38px',
  borderRadius: '50%',
  border: '2px solid #ffffff',
  backgroundColor: 'transparent',
  color: '#ffffff',
  cursor: 'pointer',
  fontSize: '24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const paperPreviewBoxStyle = {
  width: '54px',
  height: '54px',
  borderRadius: '10px',
  border: '2px solid #3c345f',
  backgroundColor: '#ece8f5',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  cursor: 'pointer',
};

const paperPreviewBlankStyle = {
  width: '38px',
  height: '42px',
  border: '2px solid #6a5b87',
  borderRadius: '4px',
  backgroundColor: '#ffffff',
};

const paperPreviewMathStyle = {
  width: '38px',
  height: '42px',
  border: '2px solid #6a5b87',
  borderRadius: '4px',
  backgroundColor: '#ffffff',
  backgroundImage:
    'linear-gradient(rgba(106, 91, 135, 0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(106, 91, 135, 0.25) 1px, transparent 1px)',
  backgroundSize: '8px 8px',
};

const paperPreviewLinedWrapper = {
  width: '38px',
  height: '42px',
  border: '2px solid #6a5b87',
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
  backgroundColor: '#6a5b87',
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