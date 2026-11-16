import { useState } from 'react';
import { signIn } from '../api.js';

// The first screen: log in or create an account
export default function Login({ onDone }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function go(kind) {
    try {
      await signIn(kind, email, password);
      onDone();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div id="login">
      <h1>Mark-Plot</h1>
      <p>Draw your field map for organic inspection.</p>
      <label>Email</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <label>Password (6+ characters)</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <div className="row">
        <button onClick={() => go('login')}>Log in</button>
        <button className="grey" onClick={() => go('register')}>Create account</button>
      </div>
      <p style={{ color: '#c62828' }}>{error}</p>
    </div>
  );
}