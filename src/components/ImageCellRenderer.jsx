import React from 'react';

const ImageCellRenderer = ({ data }) => {
  const imgUrl = `https://sodimac.scene7.com/is/image/SodimacCL/${data.item_sku_num}?fmt=jpg&fit=constrain,1&wid=170&hei=170`; 
  return (
    <img src={imgUrl} alt="Producto" style={{ width: '50px', height: '50px' }} onError={(e) => e.target.src = 'https://via.placeholder.com/50'} />
  );
};

export default ImageCellRenderer;
