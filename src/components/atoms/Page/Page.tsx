import { css } from '@emotion/react';
import { ComponentPropsWithoutRef, FC } from 'react';
import { observer } from 'mobx-react-lite';

interface PageProps extends ComponentPropsWithoutRef<'div'> {

}

const styles = {
	Page: () => css({
		display: 'flex',
		flexDirection: 'column',
		width: '100%',
		height: '100%',
	}),
};

const Page: FC<PageProps> = ({
	children,
	...props
}) => {
	return (
		<div
			css={styles.Page()}
			{...props}
		>
			{children}
		</div>
	);
};

export default observer(Page);
