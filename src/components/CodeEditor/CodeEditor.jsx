import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import Swal from 'sweetalert2';
import { 
  FileText, 
  Search, 
  GitBranch, 
  Bug, 
  Package, 
  Settings, 
  ChevronRight,
  ChevronDown,
  File,
  Folder,
  FolderOpen,
  X,
  Plus,
  MoreHorizontal,
  Terminal,
  Play,
  Square,
  RefreshCw,
  Download,
  Search as SearchIcon,
  Trash2,
  Edit
} from 'lucide-react';

const CodeEditor = () => {
  const [activeFile, setActiveFile] = useState(null);
  const [openTabs, setOpenTabs] = useState([]);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [panelVisible, setPanelVisible] = useState(true);
  const [panelHeight, setPanelHeight] = useState(250);
  const [activePanel, setActivePanel] = useState('output');
  const [terminalOutput, setTerminalOutput] = useState('$ Welcome to Code Editor on CodeCircle\n$ Ready for commands...');
  const [jsConsoleOutput, setJsConsoleOutput] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const editorRef = useRef(null);
  const iframeRef = useRef(null);
  const resizeRef = useRef(null);

  const [files, setFiles] = useState({
    'index.html': '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>My Web App</title>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n  <h1>Hello, Code Circle!</h1>\n  <button onclick="greet()">Click Me</button>\n  <script src="script.js"></script>\n</body>\n</html>',
    'style.css': 'body {\n  font-family: Arial, sans-serif;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  background-color: #f0f0f0;\n}\n\nh1 {\n  color: #333;\n}\n\nbutton {\n  padding: 10px 20px;\n  font-size: 16px;\n  background-color: #007acc;\n  color: white;\n  border: none;\n  cursor: pointer;\n}\n\nbutton:hover {\n  background-color: #005f99;\n}',
    'script.js': 'function greet() {\n  console.log("Hello from Code Circle!");\n  alert("Hello from Code Circle!");\n}'
  });

  const [fileTree, setFileTree] = useState([{
    name: 'project',
    type: 'folder',
    expanded: true,
    children: [
      { name: 'index.html', type: 'file', key: 'index.html' },
      { name: 'style.css', type: 'file', key: 'style.css' },
      { name: 'script.js', type: 'file', key: 'script.js' }
    ]
  }]);

  useEffect(() => {
    Swal.fire({
      title: 'Welcome to Code Editor on CodeCircle',
      text: 'Version 1. More updates coming soon!',
      icon: 'success',
      timer: 5000,
      timerProgressBar: true,
      showConfirmButton: false,
      background: '#1e293b',
      color: '#e5e7eb',
      toast: true,
      position: 'top-end'
    });
  }, []);

  const getFileLanguage = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    const langMap = {
      'js': 'javascript', 'jsx': 'javascript', 'ts': 'typescript', 'tsx': 'typescript',
      'css': 'css', 'scss': 'scss', 'html': 'html', 'json': 'json',
      'md': 'markdown', 'py': 'python', 'java': 'java', 'cpp': 'cpp',
      'c': 'c', 'cs': 'csharp', 'php': 'php', 'go': 'go', 'rb': 'ruby'
    };
    return langMap[ext] || 'plaintext';
  };

  const closeTab = (fileName, e) => {
    e.stopPropagation();
    const newTabs = openTabs.filter(tab => tab !== fileName);
    setOpenTabs(newTabs);
    if (activeFile === fileName && newTabs.length > 0) {
      setActiveFile(newTabs[newTabs.length - 1]);
    } else if (newTabs.length === 0) {
      setActiveFile(null);
    }
  };

  const openFile = (filePath, lineNumber = null) => {
    if (!openTabs.includes(filePath)) {
      setOpenTabs([...openTabs, filePath]);
    }
    setActiveFile(filePath);
    if (lineNumber && editorRef.current) {
      editorRef.current.revealLineInCenter(lineNumber);
      editorRef.current.setSelection({
        startLineNumber: lineNumber,
        startColumn: 1,
        endLineNumber: lineNumber,
        endColumn: files[filePath].split('\n')[lineNumber - 1].length + 1
      });
    }
  };

  const createNewFile = (parentPath = '') => {
    const fileName = prompt('Enter file name (e.g., index.html):');
    if (!fileName) return;

    const newFile = { name: fileName, type: 'file', key: fileName };
    setFileTree((prevTree) => {
      const newTree = JSON.parse(JSON.stringify(prevTree));
      const pathIndices = parentPath ? parentPath.split('-').map(Number) : [];
      let current = newTree[0];
      for (const index of pathIndices) {
        current = current.children[index];
      }
      current.children.push(newFile);
      return newTree;
    });
    setFiles(prev => ({ ...prev, [fileName]: '' }));
    openFile(fileName);
    setTerminalOutput(prev => prev + `\n$ Created file: ${fileName}`);
  };

  const createNewFolder = (parentPath = '') => {
    const folderName = prompt('Enter folder name:');
    if (!folderName) return;

    setFileTree((prevTree) => {
      const newTree = JSON.parse(JSON.stringify(prevTree));
      const pathIndices = parentPath ? parentPath.split('-').map(Number) : [];
      let current = newTree[0];
      for (const index of pathIndices) {
        current = current.children[index];
      }
      current.children.push({ name: folderName, type: 'folder', expanded: false, children: [] });
      return newTree;
    });
    setTerminalOutput(prev => prev + `\n$ Created folder: ${folderName}`);
  };

  const deleteItem = (path, itemName, itemType) => {
    if (!confirm(`Delete ${itemType} "${itemName}"?`)) return;

    setFileTree((prevTree) => {
      const newTree = JSON.parse(JSON.stringify(prevTree));
      const pathIndices = path ? path.split('-').map(Number) : [];
      let current = newTree[0];
      for (let i = 0; i < pathIndices.length - 1; i++) {
        current = current.children[pathIndices[i]];
      }
      current.children = current.children.filter((_, index) => index !== pathIndices[pathIndices.length - 1]);
      return newTree;
    });

    if (itemType === 'file') {
      setFiles(prev => {
        const newFiles = { ...prev };
        delete newFiles[itemName];
        return newFiles;
      });
      if (activeFile === itemName) setActiveFile(null);
      setOpenTabs(prev => prev.filter(tab => tab !== itemName));
    }
    setTerminalOutput(prev => prev + `\n$ Deleted ${itemType}: ${itemName}`);
  };

  const renameItem = (path, oldName, itemType) => {
    const newName = prompt(`Enter new name for "${oldName}":`);
    if (!newName || newName === oldName) return;

    setFileTree((prevTree) => {
      const newTree = JSON.parse(JSON.stringify(prevTree));
      const pathIndices = path ? path.split('-').map(Number) : [];
      let current = newTree[0];
      for (let i = 0; i < pathIndices.length - 1; i++) {
        current = current.children[pathIndices[i]];
      }
      const item = current.children[pathIndices[pathIndices.length - 1]];
      item.name = newName;
      if (itemType === 'file') item.key = newName;
      return newTree;
    });

    if (itemType === 'file') {
      setFiles(prev => {
        const newFiles = { ...prev };
        newFiles[newName] = newFiles[oldName];
        delete newFiles[oldName];
        return newFiles;
      });
      if (activeFile === oldName) setActiveFile(newName);
      setOpenTabs(prev => prev.map(tab => tab === oldName ? newName : tab));
    }
    setTerminalOutput(prev => prev + `\n$ Renamed ${itemType}: ${oldName} to ${newName}`);
  };

  const toggleFolder = (path) => {
    setFileTree((prevTree) => {
      const newTree = JSON.parse(JSON.stringify(prevTree));
      const pathIndices = path ? path.split('-').map(Number) : [];
      let current = newTree[0];
      for (const index of pathIndices) {
        current = current.children[index];
      }
      current.expanded = !current.expanded;
      return newTree;
    });
  };

  const handleEditorMount = (editor, monaco) => {
    editorRef.current = editor;

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      setTerminalOutput(prev => prev + `\n$ File saved: ${activeFile}`);
      updatePreview();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyW, () => {
      if (openTabs.length > 0) {
        closeTab(activeFile, { stopPropagation: () => {} });
      }
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyP, () => {
      const command = prompt('Enter command (e.g., new file, new folder, search <query>, rename <file>, delete <file>):');
      if (command === 'new file') {
        createNewFile();
      } else if (command === 'new folder') {
        createNewFolder();
      } else if (command.startsWith('search ')) {
        setSearchQuery(command.slice(7));
        setActivePanel('search');
      } else if (command.startsWith('rename ')) {
        const fileName = command.slice(7);
        const path = fileTree[0].children.find(item => item.key === fileName)?.path || '';
        if (fileName && files[fileName]) renameItem(path, fileName, 'file');
      } else if (command.startsWith('delete ')) {
        const fileName = command.slice(7);
        const path = fileTree[0].children.find(item => item.key === fileName)?.path || '';
        if (fileName && files[fileName]) deleteItem(path, fileName, 'file');
      }
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyF, () => {
      const query = prompt('Enter search query:');
      if (query) {
        setSearchQuery(query);
        setActivePanel('search');
      }
    });
  };

  const updatePreview = () => {
    if (!iframeRef.current) return;

    setJsConsoleOutput([]);
    const htmlContent = files['index.html'] || '';
    const cssContent = files['style.css'] ? `<style>${files['style.css']}</style>` : '';
    const jsContent = files['script.js'] ? `
      <script>
        (function() {
          const originalLog = console.log;
          const originalError = console.error;
          console.log = (...args) => {
            window.parent.postMessage({ type: 'console', method: 'log', message: args.join(' ') }, '*');
            originalLog.apply(console, args);
          };
          console.error = (...args) => {
            window.parent.postMessage({ type: 'console', method: 'error', message: args.join(' ') }, '*');
            originalError.apply(console, args);
          };
          try {
            ${files['script.js']}
          } catch (e) {
            window.parent.postMessage({ type: 'console', method: 'error', message: e.message }, '*');
          }
        })();
      </script>
    ` : '';

    const fullHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        ${cssContent}
      </head>
      <body>
        ${htmlContent}
        ${jsContent}
      </body>
      </html>
    `;

    const iframe = iframeRef.current;
    iframe.srcdoc = fullHtml;
    setTerminalOutput(prev => prev + `\n$ Preview updated for index.html`);
  };

  const runCode = () => {
    if (!activeFile) return;

    const lang = getFileLanguage(activeFile);
    setTerminalOutput(prev => prev + `\n$ Running ${activeFile} (${lang})...`);

    if (lang === 'javascript' || lang === 'html' || lang === 'css') {
      updatePreview();
    } else {
      setTerminalOutput(prev => prev + `\nExecution not supported for ${lang}. Use HTML/CSS/JS for live preview.`);
    }
  };

  const renderFileTree = (items, level = 0, parentPath = '') => {
    return items.map((item, index) => {
      const currentPath = parentPath ? `${parentPath}-${index}` : `${index}`;
      item.path = currentPath;
      return (
        <div key={currentPath} style={{ marginLeft: `${level * 16}px` }}>
          <div
            className="file-item"
            onClick={() => {
              if (item.type === 'folder') {
                toggleFolder(currentPath);
              } else if (item.key) {
                openFile(item.key);
              }
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '4px 8px',
              cursor: 'pointer',
              fontSize: '13px',
              color: '#e5e7eb',
              backgroundColor: activeFile === item.key ? 'rgba(99,102,241,0.2)' : 'transparent',
              borderRadius: '4px'
            }}
          >
            {item.type === 'folder' ? (
              <>
                {item.expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                {item.expanded ? <FolderOpen size={14} style={{ marginLeft: '4px', marginRight: '6px' }} /> : 
                               <Folder size={14} style={{ marginLeft: '4px', marginRight: '6px' }} />}
                <span>{item.name}</span>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px' }}>
                  <Plus size={12} style={{ cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); createNewFile(currentPath); }} title="New File" />
                  <Folder size={12} style={{ cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); createNewFolder(currentPath); }} title="New Folder" />
                  <Edit size={12} style={{ cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); renameItem(currentPath, item.name, 'folder'); }} title="Rename" />
                  <Trash2 size={12} style={{ cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); deleteItem(currentPath, item.name, 'folder'); }} title="Delete" />
                </div>
              </>
            ) : (
              <>
                <File size={14} style={{ marginLeft: '16px', marginRight: '6px' }} />
                <span>{item.name}</span>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px' }}>
                  <Edit size={12} style={{ cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); renameItem(currentPath, item.name, 'file'); }} title="Rename" />
                  <Trash2 size={12} style={{ cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); deleteItem(currentPath, item.name, 'file'); }} title="Delete" />
                </div>
              </>
            )}
          </div>
          {item.type === 'folder' && item.expanded && item.children && (
            <div>
              {renderFileTree(item.children, level + 1, currentPath)}
            </div>
          )}
        </div>
      );
    });
  };

  const searchFiles = () => {
    if (!searchQuery) return [];
    return Object.entries(files)
      .filter(([name, content]) => content.toLowerCase().includes(searchQuery.toLowerCase()))
      .map(([name, content]) => ({
        name,
        matches: content.split('\n').map((line, index) => 
          line.toLowerCase().includes(searchQuery.toLowerCase()) ? { line: index + 1, content: line } : null
        ).filter(Boolean)
      }));
  };

  const handleResize = (e) => {
    const startY = e.clientY;
    const startHeight = panelHeight;

    const onMouseMove = (moveEvent) => {
      const newHeight = startHeight + (startY - moveEvent.clientY);
      if (newHeight >= 100 && newHeight <= 600) {
        setPanelHeight(newHeight);
      }
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'console') {
        setJsConsoleOutput(prev => [...prev, `[${event.data.method.toUpperCase()}] ${event.data.message}`]);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    if (activeFile) updatePreview();
  }, [activeFile, files]);

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      background: 'linear-gradient(to bottom, #0f172a, #1e293b)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Title Bar */}
      <div style={{
        height: '35px',
        backgroundColor: 'rgba(30,41,59,0.3)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#e5e7eb',
        fontSize: '13px',
        fontWeight: '400'
      }}>
        Visual Studio Code Clone - Enhanced
      </div>

      <div style={{ display: 'flex', flex: 1 }}>
        {/* Activity Bar */}
        <div style={{
          width: '48px',
          backgroundColor: 'rgba(17,24,39,0.8)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: '8px',
          gap: '8px',
          borderRight: '1px solid rgba(255,255,255,0.1)'
        }}>
          {[
            { icon: FileText, active: true, title: 'Explorer' },
            { icon: Search, active: false, title: 'Search' },
            { icon: GitBranch, active: false, title: 'Source Control' },
            { icon: Bug, active: false, title: 'Debug' },
            { icon: Package, active: false, title: 'Extensions' }
          ].map((item, index) => (
            <div
              key={index}
              style={{
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                borderLeft: item.active ? '2px solid #6366f1' : 'none',
                backgroundColor: item.active ? 'rgba(55,55,61,0.5)' : 'transparent',
                color: item.active ? '#ffffff' : '#9ca3af'
              }}
              title={item.title}
              onClick={() => {
                if (item.title === 'Search') {
                  setActivePanel('search');
                  setSearchQuery('');
                }
              }}
            >
              <item.icon size={20} />
            </div>
          ))}
          
          <div style={{ marginTop: 'auto', marginBottom: '8px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#9ca3af'
            }}>
              <Settings size={20} />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        {sidebarVisible && (
          <div style={{
            width: '300px',
            backgroundColor: 'rgba(30,41,59,0.3)',
            backdropFilter: 'blur(10px)',
            borderRight: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Explorer Header */}
            <div style={{
              height: '35px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 16px',
              backgroundColor: 'rgba(45,55,72,0.5)',
              color: '#e5e7eb',
              fontSize: '11px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              <span>Explorer</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Plus size={16} style={{ cursor: 'pointer' }} onClick={() => createNewFile()} title="New File" />
                <Folder size={16} style={{ cursor: 'pointer' }} onClick={() => createNewFolder()} title="New Folder" />
                <MoreHorizontal size={16} style={{ cursor: 'pointer' }} />
              </div>
            </div>

            {/* File Tree Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              padding: '8px 12px',
              color: '#e5e7eb',
              fontSize: '13px',
              fontWeight: '600'
            }}>
              <ChevronDown size={12} style={{ marginRight: '4px' }} />
              <span style={{ textTransform: 'uppercase', fontSize: '11px', letterSpacing: '1px' }}>
                Project
              </span>
            </div>

            {/* File Tree */}
            <div style={{ flex: 1, overflow: 'auto', padding: '0 4px' }}>
              {renderFileTree(fileTree[0].children)}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Tab Bar */}
          <div style={{
            height: '35px',
            backgroundColor: 'rgba(45,55,72,0.5)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            overflow: 'hidden'
          }}>
            {openTabs.map((tab) => (
              <div
                key={tab}
                onClick={() => setActiveFile(tab)}
                style={{
                  height: '35px',
                  minWidth: '120px',
                  maxWidth: '200px',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 12px',
                  cursor: 'pointer',
                  backgroundColor: activeFile === tab ? 'rgba(30,41,59,0.3)' : 'rgba(45,55,72,0.5)',
                  borderRight: '1px solid rgba(255,255,255,0.1)',
                  borderTop: activeFile === tab ? '1px solid #6366f1' : 'none',
                  color: activeFile === tab ? '#ffffff' : '#9ca3af',
                  fontSize: '13px'
                }}
              >
                <File size={14} style={{ marginRight: '6px', flexShrink: 0 }} />
                <span style={{ 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis', 
                  whiteSpace: 'nowrap',
                  flex: 1
                }}>
                  {tab}
                </span>
                <X 
                  size={14} 
                  style={{ 
                    marginLeft: '6px', 
                    flexShrink: 0,
                    opacity: 0.7,
                  }}
                  onClick={(e) => closeTab(tab, e)}
                />
              </div>
            ))}
          </div>

          {/* Editor */}
          <div style={{ flex: 1 }}>
            {activeFile && (
              <Editor
                height="100%"
                language={getFileLanguage(activeFile)}
                theme="vs-dark"
                value={files[activeFile] || ''}
                onChange={(value) => {
                  setFiles(prev => ({ ...prev, [activeFile]: value || '' }));
                  updatePreview();
                }}
                onMount={handleEditorMount}
                options={{
                  selectOnLineNumbers: true,
                  automaticLayout: true,
                  minimap: { enabled: true },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                  fontFamily: '"Fira Code", "SF Mono", "Monaco", "Inconsolata", "Roboto Mono", monospace',
                  fontLigatures: true,
                  lineNumbers: 'on',
                  rulers: [80, 120],
                  wordWrap: 'off',
                  folding: true,
                  foldingHighlight: true,
                  foldingStrategy: 'indentation',
                  showFoldingControls: 'always',
                  unfoldOnClickAfterEndOfLine: true,
                  cursorBlinking: 'blink',
                  cursorSmoothCaretAnimation: true,
                  cursorWidth: 2,
                  letterSpacing: 0.5,
                  lineHeight: 1.6,
                  renderWhitespace: 'selection',
                  renderControlCharacters: true,
                  renderIndentGuides: true,
                  highlightActiveIndentGuide: true,
                  bracketPairColorization: { enabled: true },
                  guides: { bracketPairs: true, indentation: true },
                  suggest: { insertMode: 'replace' },
                  quickSuggestions: true,
                  parameterHints: { enabled: true },
                  acceptSuggestionOnEnter: 'on',
                  tabCompletion: 'on',
                  wordBasedSuggestions: true,
                  formatOnType: true,
                  formatOnPaste: true,
                  autoIndent: 'full',
                  contextmenu: true,
                  mouseWheelZoom: true,
                  multiCursorModifier: 'ctrlCmd',
                  accessibilitySupport: 'auto',
                  find: {
                    seedSearchStringFromSelection: 'always',
                    autoFindInSelection: 'never'
                  }
                }}
              />
            )}
            {!activeFile && (
              <div style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#9ca3af',
                fontSize: '16px'
              }}>
                Open or create a file to start editing
              </div>
            )}
          </div>

          {/* Bottom Panel */}
          {panelVisible && (
            <div style={{
              height: `${panelHeight}px`,
              backgroundColor: 'rgba(30,41,59,0.3)',
              backdropFilter: 'blur(10px)',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* Resize Handle */}
              <div
                ref={resizeRef}
                style={{
                  height: '4px',
                  backgroundColor: 'rgba(99,102,241,0.5)',
                  cursor: 'ns-resize',
                }}
                onMouseDown={handleResize}
              />
              {/* Panel Tabs */}
              <div style={{
                height: '35px',
                backgroundColor: 'rgba(45,55,72,0.5)',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                padding: '0 16px'
              }}>
                {['Problems', 'Output', 'JS Console', 'Terminal', 'Search'].map((panel) => (
                  <div
                    key={panel}
                    onClick={() => setActivePanel(panel.toLowerCase().replace(' ', ''))}
                    style={{
                      cursor: 'pointer',
                      color: activePanel === panel.toLowerCase().replace(' ', '') ? '#ffffff' : '#9ca3af',
                      fontSize: '13px',
                      padding: '8px 0',
                      borderBottom: activePanel === panel.toLowerCase().replace(' ', '') ? '1px solid #6366f1' : 'none'
                    }}
                  >
                    <Terminal size={14} style={{ marginRight: '6px' }} />
                    {panel}
                  </div>
                ))}
                
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                  <Play size={14} style={{ cursor: 'pointer', color: '#4caf50' }} onClick={runCode} title="Run Code" />
                  <Square size={14} style={{ cursor: 'pointer', color: '#f44336' }} onClick={() => setJsConsoleOutput([])} title="Clear Console" />
                  <RefreshCw size={14} style={{ cursor: 'pointer', color: '#2196f3' }} onClick={updatePreview} title="Refresh Preview" />
                  <X size={14} style={{ cursor: 'pointer', color: '#9ca3af' }} onClick={() => setPanelVisible(false)} title="Close Panel" />
                </div>
              </div>

              {/* Panel Content */}
              <div style={{
                flex: 1,
                backgroundColor: 'rgba(17,24,39,0.8)',
                color: '#e5e7eb',
                padding: '12px',
                fontSize: '13px',
                fontFamily: '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", monospace',
                overflow: 'auto'
              }}>
                {activePanel === 'output' && (
                  <iframe
                    ref={iframeRef}
                    style={{ width: '100%', height: '100%', border: 'none', background: '#fff' }}
                    title="Output Preview"
                    sandbox="allow-scripts"
                  />
                )}
                {activePanel === 'jsconsole' && (
                  <div style={{ whiteSpace: 'pre-wrap' }}>
                    {jsConsoleOutput.length > 0 ? jsConsoleOutput.map((log, index) => (
                      <div key={index} style={{ color: log.includes('[ERROR]') ? '#f44336' : '#e5e7eb' }}>
                        {log}
                      </div>
                    )) : 'No console output'}
                  </div>
                )}
                {activePanel === 'terminal' && (
                  <div style={{ whiteSpace: 'pre-wrap' }}>
                    {terminalOutput}
                  </div>
                )}
                {activePanel === 'search' && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                      <SearchIcon size={14} style={{ marginRight: '8px' }} />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search in files..."
                        style={{
                          background: 'rgba(45,55,72,0.5)',
                          color: '#e5e7eb',
                          border: '1px solid rgba(255,255,255,0.1)',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          width: '100%',
                          fontSize: '13px'
                        }}
                      />
                    </div>
                    <div>
                      {searchFiles().map((file) => (
                        <div key={file.name} style={{ marginBottom: '8px' }}>
                          <div
                            style={{ fontWeight: '600', cursor: 'pointer' }}
                            onClick={() => openFile(file.name)}
                          >
                            {file.name}
                          </div>
                          {file.matches.map((match, index) => (
                            <div
                              key={index}
                              style={{ paddingLeft: '16px', fontSize: '12px', color: '#9ca3af', cursor: 'pointer' }}
                              onClick={() => openFile(file.name, match.line)}
                            >
                              Line {match.line}: {match.content}
                            </div>
                          ))}
                        </div>
                      ))}
                      {searchFiles().length === 0 && <div>No results found</div>}
                    </div>
                  </div>
                )}
                {activePanel === 'problems' && (
                  <div>No problems detected</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div style={{
        height: '22px',
        backgroundColor: 'rgba(99,102,241,0.5)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        color: '#ffffff',
        fontSize: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <GitBranch size={12} />
            <span>main</span>
          </div>
          <div>✓ No issues</div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span>Ln {activeFile && files[activeFile] ? files[activeFile].split('\n').length : 0}, Col 1</span>
          <span>Spaces: 2</span>
          <span>UTF-8</span>
          <span>{activeFile ? getFileLanguage(activeFile).toUpperCase() : ''}</span>
          <span>⚡ 2.1s</span>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;