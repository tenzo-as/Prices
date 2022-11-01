import { ComponentPropsWithoutRef, useEffect, useState, VFC } from 'react';
import { observer } from 'mobx-react-lite';
import { css } from '@emotion/react';
import Inner from '@root/components/atoms/Inner/Inner';
import getEm from '@root/assets/utilities/getEm';
import api, { ApiPrices } from '@root/assets/utilities/api';
import {
	Alert,
	Autocomplete,
	Backdrop,
	CircularProgress,
	Container, Pagination,
	Paper,
	Snackbar,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Typography,
} from '@mui/material';
import useAutocomplete  from '@root/hooks/useAutocomplete';
import useBackdrop from '@root/hooks/useBackdrop';
import theme from '@root/store/theme';
import useSnackbar from '@root/hooks/useSnackbar';
import { useBoolean } from 'usehooks-ts';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';

export interface HomeProps extends ComponentPropsWithoutRef<'div'> {

}

type Cell = number | string;

enum SortMode {
	country = 'country',
	cost = 'cost',
	count = 'count',
}

type Sort = {
	isOrderByAsc: boolean,
	mode: SortMode,
};

const styles = {
	Home: () => css({

	}),
	filters: () => css({
	    display: 'flex',
		flexWrap: 'wrap',
		gap: getEm(16),
		marginTop: getEm(32),
	}),
	filter: () => css({
	    minWidth: getEm(200),
		backgroundColor: theme.palette.common.white,
	}),
	tableContainer: () => css({
	    marginTop: getEm(24),
		maxHeight: getEm(550),
		border: `${getEm(1)} solid ${theme.palette.divider}`,
		boxShadow: `0 ${getEm(4)} ${getEm(8)} ${theme.palette.divider}`,
		borderRadius: getEm(4),
	}),
	cell: (isHead?: boolean, isClickable?: boolean) => css({
		cursor: isClickable ? 'pointer' : '',
		backgroundColor: isHead ? theme.palette.grey[100] : '',
		'&:not(:first-of-type)': {
			borderLeft: `${getEm(1)} solid ${theme.palette.divider}`,
		},
	    '&:nth-of-type(1)': {
			width: '32%',
			minWidth: getEm(200),
		},
	    '&:nth-of-type(2)': {
			width: '20%',
			minWidth: getEm(130),
		},
	    '&:nth-of-type(3)': {
			width: '16%',
			minWidth: getEm(150),
		},
	    '&:nth-of-type(4)': {
			width: '16%',
			minWidth: getEm(130),
		},
	    '&:nth-of-type(5)': {
			width: '16%',
			minWidth: getEm(200),
		},
	}),
	sortColumn: () => css({
	    display: 'inline-grid',
		gridAutoFlow: 'column',
		gap: getEm(4),
		alignItems: 'center',
	}),
	sortIcon: (currentMode: SortMode, sort: Sort) => css({
		transform: `rotateX(${sort.isOrderByAsc ? '0deg' : '180deg'})`,
		opacity: currentMode === sort.mode ? 0.8 : 0.2,
		fontSize: '20px',
	    transition: `
	    	transform 300ms,
	    	opacity 300ms
	    `,
		'th:hover > div > &': {
		    opacity: currentMode === sort.mode ? 1 : 0.6,
		},
	}),
	paginationContainer: () => css({
		display: 'grid',
		justifyContent: 'center',
	    marginTop: getEm(32),
	}),
	backdrop: () => css({
		color: theme.palette.common.white,
		zIndex: theme.zIndex.drawer,
	}),
};

const Home: VFC<HomeProps> = ({
	...props
}) => {
	const backdrop = useBackdrop();
	const snackbar = useSnackbar();

	const showError = (value?: string) => {
		snackbar.open({
			status: 'error',
			value: value || 'Упс, что-то пошло не так :( Поробуйте выбрать другую страну или сервис',
		});
	};

	const isFiltersDefaultValueSet = useBoolean(false);

	const country = useAutocomplete();
	const product = useAutocomplete(false);

	const handleCountryChange: typeof country.handleChange = async (event, value) => {
		if (!value || !product.value) return country.handleChange(event, value);

		const productsResponse = await api.products.list({ country: String(value.id) });

		if (!productsResponse.data) return showError();

		if (Object.keys(productsResponse.data).includes(String(product.value.id))) {
			return country.handleChange(event, value);
		} else {
			return showError(`В стране "${value.name}" нет сервиса "${product.value.name}". Выберите другую страну или сервис.`);
		}
	};

	const handleCountries = async () => {
		country.setIsLoading(true);

		const countriesResponse = await api.countries.list();

		if (!countriesResponse.data) {
			backdrop.setIsOpen(false);

			return showError();
		}

		country.setOptions(Object.keys(countriesResponse.data).map(countryKey => ({
			id: countryKey,
			name: countriesResponse.data[countryKey].text_ru,
		})));

		country.setIsLoading(false);
	};

	useEffect(() => {
		handleCountries();
	}, []);

	const handleProducts = async (countryValue: typeof country.value) => {
		product.setIsLoading(true);

		const productsResponse = await api.products.list({ country: countryValue ? String(countryValue.id) : undefined });

		if (!productsResponse.data) return showError();

		product.setOptions(Object.keys(productsResponse.data).map(productKey => ({
			id: productKey,
			name: productKey,
		})));

		product.setIsLoading(false);
	};

	useEffect(() => {
		handleProducts(country.value)
	}, [country.value]);

	useEffect(() => {
	    if (country.options.length !== 0 && product.options.length !== 0 && !isFiltersDefaultValueSet.value) {
			const productOption = product.options.find(option => option.id === 'vkontakte');

			if (!productOption) return showError();

			product.setValue(productOption);

			isFiltersDefaultValueSet.setTrue();
		}
	}, [product.options]);

	const [table, setTable] = useState<[Cell, Cell,	Cell, Cell, Cell][]>([]);

	const handleTable = async (
		countryValue: typeof country.value,
		countryOptions: typeof country.options,
		productValue: typeof product.value,
	) => {
		backdrop.setIsOpen(true);

		const getPrices = async (): Promise<ApiPrices | null> => {
			if (!countryValue && productValue) {
				const result: ApiPrices = {};

				const pricesResponse = await api.prices.listByProduct(String(productValue.id));

				if (!pricesResponse.data) return null;

				Object.keys(pricesResponse.data).forEach(productKey => {
					Object.keys(pricesResponse.data[productKey]).forEach(countryKey => {
						if (!Object.keys(result).includes(countryKey)) {
							result[countryKey] = {
								[productKey]: pricesResponse.data[productKey][countryKey],
							};
						} else {
							if (!Object.keys(result[countryKey]).includes(productKey)) {
								result[countryKey][productKey] = pricesResponse.data[productKey][countryKey];
							} else {
								result[countryKey][productKey] = {
									...result[countryKey][productKey],
									...pricesResponse.data[productKey][countryKey]
								};
							}
						}
					});
				});

				return result;
			} else if (countryValue && !productValue) {
				const pricesResponse = await api.prices.listByCountry(String(countryValue.id));

				return pricesResponse.data;
			} else if (countryValue && productValue) {
				const pricesResponse = await api.prices.listByCountryAndProduct(String(countryValue.id), String(productValue.id));

				return pricesResponse.data;
			} else {
				const pricesResponse = await api.prices.list();

				return pricesResponse.data;
			}
		};

		const prices = await getPrices();

		if (!prices) {
			setTable([]);

			return showError();
		}

		const newTable: typeof table = [];

		Object.keys(prices).forEach(countryKey => {
			const countryOption = countryOptions.find(option => option.id === countryKey);

			Object.keys(prices[countryKey]).forEach(productKey => {
				Object.keys(prices[countryKey][productKey]).forEach(operatorKey => {
					const operator = prices[countryKey][productKey][operatorKey];

					newTable.push([
						countryOption?.name || countryKey,
						operatorKey,
						operator.rate || 0,
						operator.cost,
						operator.count,
					]);
				});
			});
		});

		setTable(newTable);
		backdrop.setIsOpen(false);
	};

	const [page, setPage] = useState<number>(1);

	const getPageCount = (length: number) => {
		const count = parseInt((length / 30).toString());

		if (count === 0) return 1;
		else if (count === (length / 30)) return count;
		else return count + 1;
	};

	const getTableByPage = (currentTable: typeof table, currentPage: number) => {
		return currentTable.filter((row, rowIndex) => {
			if (currentPage === 1 && (rowIndex + 1) <= 30) return true;

			return (rowIndex + 1) > ((currentPage - 1) * 30) && (rowIndex + 1) < (currentPage * 30);
		});
	};

	useEffect(() => {
		if (isFiltersDefaultValueSet.value) {
	    	handleTable(country.value, country.options, product.value);

			setPage(1);
		}
	}, [isFiltersDefaultValueSet.value, country.value, country.options, product.value]);

	const [sort, setSort] = useState<Sort>({
		isOrderByAsc: true,
		mode: SortMode.country,
	});

	const ascendingComparator = (a: typeof table[number], b: typeof table[number], columnIndex: number) => {
		if (b[columnIndex] < a[columnIndex]) return 1;

		if (b[columnIndex] > a[columnIndex]) return -1;

		return 0;
	};

	const comparator = (isOrderByAsc: boolean, columnIndex: number): (
		(
			a: typeof table[number],
			b: typeof table[number]
		) => number
	) => {
		return isOrderByAsc
			? (a, b) => ascendingComparator(a, b, columnIndex)
			: (a, b) => -ascendingComparator(a, b, columnIndex)
		;
	};

	const getSortedTable = (currentTable: typeof table, currentSort: typeof sort, currentPage: number) => {
		if (currentSort.mode === SortMode.count) {
			return getTableByPage(
				currentTable.sort(comparator(currentSort.isOrderByAsc, 4)),
				currentPage
			);
		} else if (currentSort.mode === SortMode.cost) {
			return getTableByPage(
				currentTable.sort(comparator(currentSort.isOrderByAsc, 3)),
				currentPage
			);
		} else {
			return getTableByPage(
				currentTable.sort(comparator(currentSort.isOrderByAsc, 0)),
				currentPage
			);
		}
	};

	const handleSort = (mode: SortMode) => {
		setSort(prevState => ({
			isOrderByAsc: prevState.mode === mode ? !prevState.isOrderByAsc : true,
			mode: mode,
		}));
	};

	return (
		<div
			css={styles.Home()}
			{...props}
		>
			<Container maxWidth={'lg'}>
				<Inner>
					<Typography
						variant={'h2'}
						fontWeight={500}
					>
						Прайс-лист
					</Typography>
					<div css={styles.filters()}>
						<Autocomplete
							size={'small'}
							getOptionLabel={(option) => option.name}
							value={product.value}
							options={product.options}
							onChange={product.handleChange}
							renderInput={(params) =>
								<TextField
									{...params}
									label={'Сервис'}
									placeholder={'Сервис'}
									InputProps={{
										...params.InputProps,
										endAdornment: (
											<>
												{product.isLoading ? <CircularProgress color={'inherit'} size={20} /> : null}
												{params.InputProps.endAdornment}
											</>
										),
									}}
								/>
							}
							loading={product.isLoading}
							css={styles.filter()}
						/>
						<Autocomplete
							size={'small'}
							getOptionLabel={(option) => option.name}
							value={country.value}
							options={country.options}
							onChange={handleCountryChange}
							renderInput={(params) =>
								<TextField
									{...params}
									label={'Страна'}
									placeholder={'Страна'}
									InputProps={{
										...params.InputProps,
										endAdornment: (
											<>
												{country.isLoading ? <CircularProgress color={'inherit'} size={20} /> : null}
												{params.InputProps.endAdornment}
											</>
										),
									}}
								/>
							}
							css={styles.filter()}
						/>
					</div>
					<TableContainer
						component={Paper}
						css={styles.tableContainer()}
					>
						<Table stickyHeader={true}>
							<TableHead>
								<TableRow>
									<TableCell
										onClick={() => handleSort(SortMode.country)}
										css={styles.cell(true, true)}
									>
										<div css={styles.sortColumn()}>
											Страна <ArrowDownwardRoundedIcon css={styles.sortIcon(SortMode.country, sort)}/>
										</div>
									</TableCell>
									<TableCell
										align={'right'}
										css={styles.cell(true)}
									>
										Оператор
									</TableCell>
									<TableCell
										align={'right'}
										css={styles.cell(true)}
									>
										Доставка (%)
									</TableCell>
									<TableCell
										align={'right'}
										onClick={() => handleSort(SortMode.cost)}
										css={styles.cell(true, true)}
									>
										<div css={styles.sortColumn()}>
											<ArrowDownwardRoundedIcon css={styles.sortIcon(SortMode.cost, sort)}/> Цена (₽)
										</div>
									</TableCell>
									<TableCell
										align={'right'}
										onClick={() => handleSort(SortMode.count)}
										css={styles.cell(true, true)}
									>
										<div css={styles.sortColumn()}>
											<ArrowDownwardRoundedIcon css={styles.sortIcon(SortMode.count, sort)}/> Количество (шт)
										</div>
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{getSortedTable(table, sort, page).map((row, rowIndex) =>
									<TableRow key={rowIndex}>
										<TableCell css={styles.cell()}>{row[0]}</TableCell>
										<TableCell
											align={'right'}
											css={styles.cell()}
										>
											{row[1]}
										</TableCell>
										<TableCell
											align={'right'}
											css={styles.cell()}
										>
											{row[2]}
										</TableCell>
										<TableCell
											align={'right'}
											css={styles.cell()}
										>
											{row[3]}
										</TableCell>
										<TableCell
											align={'right'}
											css={styles.cell()}
										>
											{row[4]}
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</TableContainer>
					<div css={styles.paginationContainer()}>
						<Pagination
							count={getPageCount(table.length)}
							page={page}
							onChange={(_, currentPage) => setPage(currentPage)}
						/>
					</div>
					<Snackbar
						anchorOrigin={{
							horizontal: 'center',
							vertical: 'top',
						}}
						open={snackbar.isOpen}
						onClose={snackbar.handleClose}
					>
						<Alert
							severity={snackbar.message?.status || 'error'}
							onClose={snackbar.handleClose}
						>
							{snackbar.message?.value || ''}
						</Alert>
					</Snackbar>
					<Backdrop
						open={backdrop.isOpen}
						onClick={backdrop.handleClose}
						css={styles.backdrop()}
					>
						<CircularProgress color={'inherit'}/>
					</Backdrop>
				</Inner>
			</Container>
		</div>
	);
};

export default observer(Home);
