import { VFC } from 'react';
import { observer } from 'mobx-react-lite';
import { Global, ThemeProvider } from '@emotion/react';
import theme from '../../store/theme';
import globalStyles from '../../assets/themes/globalStyles';
import { Route, Routes } from 'react-router-dom';
import { routes } from '../../assets/utilities/config';
import Home from '@root/components/pages/Home/Home';
import Page from '@root/components/atoms/Page/Page';
import Main from '@root/components/atoms/Main/Main';
import 'antd/dist/antd.css';
import { CssBaseline } from '@mui/material';

const App: VFC = () => {
	return (
		<ThemeProvider theme={theme.get}>
			<CssBaseline/>
			<Global styles={globalStyles()}/>
			<Page>
				<Main>
					<Routes>
						<Route path={routes.Home} element={<Home/>}/>
					</Routes>
				</Main>
			</Page>
		</ThemeProvider>
	);
};

export default observer(App);