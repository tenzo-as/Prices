import { css } from '@emotion/react';
import getEm from '@root/assets/utilities/getEm';
import { ComponentPropsWithoutRef, FC } from 'react';
import { observer } from 'mobx-react-lite';

export interface InnerProps extends ComponentPropsWithoutRef<'div'> {

}

const styles = {
    Inner: () => css({
        padding: `${getEm(72)} 0`,
    }),
};

const Inner: FC<InnerProps> = ({
    children,
    ...props
}) => {
    return (
        <div
            css={styles.Inner()}
            {...props}
        >
            {children}
        </div>
    );
};

export default observer(Inner);
