import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './components/App/App';

const container = document.getElementById('root');

if (container === null) throw new Error('Container is not defined');

const root = createRoot(container);

root.render(
	<BrowserRouter>
		<App/>
	</BrowserRouter>
);
