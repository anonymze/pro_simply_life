'use dom';

export default function DOMComponent({dom}: { dom: import('expo/dom').DOMProps }) {
  return (
    <div style={{
      width: '200',
      height: '100',
      backgroundColor: 'red'
    }}>
      <h1 style={{ color: 'white', fontSize: 60 }}>Hello, !!!!</h1>
    </div>
  );
}
