import { css} from '@emotion/react';
import { ComponentPropsWithoutRef, FC } from 'react';
import { observer } from 'mobx-react-lite';
import { Sizes } from '@root/assets/utilities/config';

interface MainProps extends ComponentPropsWithoutRef<'main'> {

}

const styles = {
	Main: () => css({
		flexGrow: 1,
		width: '100%',
		paddingLeft: `${Sizes.SideMenuWidth}px`,
	}),
};

const Main: FC<MainProps> = ({
	children,
	...props
}) => {
	return (
		<main
			css={styles.Main()}
			{...props}
		>
			{children}
		</main>
	);
};

export default observer(Main);