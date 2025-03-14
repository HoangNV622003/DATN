import { BrowserRouter } from 'react-router-dom';
import RouterCustom from './Router';
import { ResetProvider } from './context/ResetContext';
function App() {
  return (
    <BrowserRouter>
    <ResetProvider>

      <RouterCustom/>
    </ResetProvider>
    </BrowserRouter>
  );
}

export default App;
