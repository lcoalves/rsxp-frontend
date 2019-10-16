import styled from '@react-pdf/styled-components';
import { Font } from '@react-pdf/renderer';

Font.register({
  family: 'Shlyalln',
  src: `http://` + document.location.hostname + `:3000/fonts/Shlyalln.ttf`,
});

Font.register({
  family: 'Gara',
  src: `http://` + document.location.hostname + `:3000/fonts/Gara.ttf`,
});

export const ContentView = styled.View`
  flex: 1;
  justify-content: ${props => props.justify};
  align-items: ${props => props.align};
`;

export const NameView = styled.View`
  margin-top: ${props => props.margin};
`;

export const NameText = styled.Text`
  font-family: ${props => props.fontfamily};
  font-size: ${props => props.fontsize};
`;

export const EmissionDate = styled.View`
  margin-top: ${props => props.margin};
`;

export const EmissionText = styled.Text`
  font-family: ${props => props.fontfamily};
  font-size: ${props => props.fontsize};
`;
