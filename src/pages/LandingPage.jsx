import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center', padding: '50px' }}>
      <h1>Selamat Datang di Taniku</h1>
      <p>Transformasi Digital Pertanian: Kolaborasi Petani & Dinas Pertanian</p>
      <div style={{ marginTop: '30px' }}>
        <Link to="/login" style={{ margin: '0 10px', padding: '12px 25px', textDecoration: 'none', background: '#28a745', color: 'white', borderRadius: '5px', fontWeight: 'bold' }}>
          Login
        </Link>
        <Link to="/register" style={{ margin: '0 10px', padding: '12px 25px', textDecoration: 'none', background: '#007bff', color: 'white', borderRadius: '5px', fontWeight: 'bold' }}>
          Register
        </Link>
      </div>
    </div>
  );
}

export default LandingPage;