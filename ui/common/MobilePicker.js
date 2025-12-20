import { isMobile } from 'react-device-detect';

const MobilePicker = ({ mobile, web }) => {
  return isMobile ? mobile : web;
};

export default MobilePicker;
