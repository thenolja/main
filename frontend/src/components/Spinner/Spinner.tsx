import { FC } from 'react';
import { StlyedDiv } from './Spinner.style';

export interface Props {
  style?: StyleType;
}

export interface StyleType {
  width?: string;
  height?: string;
}
const Spinner = ({ style = { width: '100%', height: '100%' } }: Props) => {
  return (
    <StlyedDiv style={style}>
      <img src="/src/assets/spinner.gif" alt="spinner" />
    </StlyedDiv>
  );
};

export default Spinner;
