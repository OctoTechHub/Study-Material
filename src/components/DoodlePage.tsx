import { faRuler, faSave } from '@fortawesome/free-solid-svg-icons';
import { faPalette } from '@fortawesome/free-solid-svg-icons/faPalette';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useRef, useEffect } from 'react';

interface Point {
  x: number;
  y: number;
}

interface DoodlePageProps {
  onSave: (doodle: string) => void;
}

const DoodlePage: React.FC<DoodlePageProps> = ({ }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [lines, setLines] = useState<Point[][]>([]);
  const [color, setColor] = useState('black');
  const [thickness, setThickness] = useState(5);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.fillStyle = '#FFFFFF'; 
        ctx.fillRect(0, 0, canvas.width, canvas.height); 
      }
    }
  }, []);

  const getCursorPosition = (event: MouseEvent | TouchEvent): Point => {
    const canvas = canvasRef.current;
    const rect = canvas?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    let clientX, clientY;

    if (event instanceof MouseEvent) {
      clientX = event.clientX;
      clientY = event.clientY;
    } else {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;
    return { x, y };
  };

  const startDrawing = (event: MouseEvent | TouchEvent) => {
    setDrawing(true);
    const position = getCursorPosition(event);
    setLines((prevLines) => [...prevLines, [position]]);
  };

  const continueDrawing = (event: MouseEvent | TouchEvent) => {
    if (!drawing) return;
    const position = getCursorPosition(event);
    setLines((prevLines) => {
      const lastLine = prevLines[prevLines.length - 1];
      lastLine.push(position);
      return [...prevLines.slice(0, -1), lastLine];
    });
    draw();
  };

  const finishDrawing = () => {
    setDrawing(false);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height); 

    ctx.fillStyle = '#FFFFFF'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height); 

    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;

    ctx.beginPath();
    lines.forEach((line) => {
      line.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
    });
    ctx.stroke();
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    event.preventDefault();
    startDrawing(event.nativeEvent);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    event.preventDefault();
    continueDrawing(event.nativeEvent);
  };

  const handleMouseUp = () => {
    finishDrawing();
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    startDrawing(event.nativeEvent);
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    continueDrawing(event.nativeEvent);
  };

  const handleTouchEnd = () => {
    finishDrawing();
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataURL = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataURL;
      a.download = 'doodle.png';
      a.click();
    }
  };

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setColor(event.target.value);
  };

  const handleThicknessChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setThickness(parseInt(event.target.value, 10));
  };

  return (
    <>
    <br></br>
    <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'pace-between' }}>
        <label style={{ marginRight: 20 }}>
          <FontAwesomeIcon icon={faPalette} style={{ marginRight: 10 }} />
          Color:
          <input type="color" value={color} onChange={handleColorChange} />
        </label>
        <label style={{ marginRight: 20 }}>
          <FontAwesomeIcon icon={faRuler} style={{ marginRight: 10 }} />
          Thickness:
          <input
            type="number"
            value={thickness}
            onChange={handleThicknessChange}
            min={1}
            max={20}
          />
        </label>
        <button onClick={handleSave}>
          <FontAwesomeIcon icon={faSave} style={{ marginRight: 10 }} />
          Save
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight * 0.8}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ border: '1px solid gray', width: '100%', height: '100%' }}
      />
    </div>
    </>
  );
}
  export default DoodlePage;