from pathlib import Path
import re

files = [
    './src/utils/catImages.js',
    './src/Layout.jsx',
    './src/main.jsx',
    './src/index.css',
    './src/pages/TimerSelection.jsx',
    './src/pages/StartPage.jsx',
    './src/pages/SignUp.jsx',
    './src/pages/Settings.jsx',
    './src/pages/PaginaMateriale.jsx',
    './src/pages/PaginaMateriale.css',
    './src/pages/Login.jsx',
    './src/pages/FriendsPage.jsx',
    './src/pages/ChatRoute.jsx',
    './src/pages/ChatPage.jsx',
    './src/pages/CharacterCustomization.jsx',
    './src/pages/CharacterCustomization.css',
    './src/pages/App.jsx',
    './src/pages/App.css',
    './src/pages/ActiveTimer.jsx',
    './src/pages/ActiveTimer.css',
    './src/components/Header.jsx',
    './src/components/Header.css',
    './src/context/AvatarContext.jsx',
    './src/context/SocketContext.jsx',
    './src/context/AuthContext.jsx',
]


def strip_js_comments(code):
    out = []
    i = 0
    n = len(code)
    in_string = None
    escape = False
    in_line = False
    in_block = False

    while i < n:
        c = code[i]
        nxt = code[i + 1] if i + 1 < n else ''

        if in_line:
            if c == '\n':
                in_line = False
                out.append(c)
            i += 1
            continue

        if in_block:
            if c == '*' and nxt == '/':
                in_block = False
                i += 2
            else:
                i += 1
            continue

        if in_string:
            out.append(c)
            if escape:
                escape = False
            elif c == '\\':
                escape = True
            elif c == in_string:
                in_string = None
            elif c == '$' and in_string == '`' and nxt == '{':
                out.append(nxt)
                i += 1
            i += 1
            continue

        if c == '/' and nxt == '/':
            in_line = True
            i += 2
            continue

        if c == '/' and nxt == '*':
            in_block = True
            i += 2
            continue

        if c in ('"', "'", '`'):
            in_string = c
            out.append(c)
            i += 1
            continue

        out.append(c)
        i += 1

    return ''.join(out)


def strip_css_comments(code):
    return re.sub(r'/\*.*?\*/', '', code, flags=re.S)


def strip_html_comments(code):
    return re.sub(r'<!--.*?-->', '', code, flags=re.S)


for rel in files:
    path = Path(rel)
    if not path.exists():
        print('MISSING', rel)
        continue
    text = path.read_text(encoding='utf-8')
    new = text
    if path.suffix in ('.css',):
        new = strip_css_comments(text)
    elif path.suffix in ('.html', '.htm'):
        new = strip_html_comments(text)
    elif path.suffix in ('.js', '.jsx'):
        new = strip_js_comments(text)

    if new != text:
        path.write_text(new, encoding='utf-8')
        print('UPDATED', rel)
    else:
        print('UNCHANGED', rel)
