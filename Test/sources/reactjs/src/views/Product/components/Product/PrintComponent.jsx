import React, { Component } from 'react';
import Barcode from "react-barcode";
import ExtendFunction from "lib/ExtendFunction";
import { Col, Row } from "react-bootstrap";

class PrintComponent extends Component {
  componentDidUpdate(prevProps, prevState) {
    if (JSON.stringify(prevProps.dataSource) !== JSON.stringify(this.props.dataSource)) {
      this.render()
    }
  }
  render() {
    let { dataSource, style, value, language } = this.props;
    let cols = [];
    return (
      <div>
        <Row justify="start" >
          {
            dataSource.map((item, index) => {
              if (parseInt(item.quantity) > 0) {
                let name = ExtendFunction.languageName(item.name)[language];
                let saleUnitPrice = ExtendFunction.FormatNumber(item.saleUnitPrice)
                let arr = [];
                let barCode = item.barCode ? item.barCode : !item.barCode ? item.code : "";
                let text = item.code ? item.code : "";
                let productName = value !== 0 && value !== 2 ? name : "";
                let strBC = "";

                for( let i in barCode )
                  strBC = strBC + barCode.charCodeAt(i)

                for (let i = 0; i < parseInt(item.quantity); i++) {
                  arr.push(<Col style={{ maxWidth: '20%' }} key={index + "_" + i}>
                    <div style={{ margin: style.margin, position: 'relative', textAlign: 'center', font: `${style.font}px monospace`, color: "black", width: style.width }}>
                      <p className="barCode" style={{ margin: "0px 0px -6.5px 0px" }}>{productName.length <= 20 ? productName : productName.slice(0,20)}</p>
                      <p style={{ textAlign: 'center', paddingTop: '5px', margin: "0px" }}>
                        <Barcode key={`BC_${index}_${i}`}
                          style={{ textAlign: 'center', padding: '0px', margin: "0px" }}
                          width={strBC.length < 42 ? 1 : 0.5}
                          fontSize={style.font}
                          height={style.height}
                          textPosition="bottom"
                          format="CODE128"
                          text={text.length <= 20 ? text : text.slice(0,20)}
                          flat={false}
                          value={barCode}
                        /></p>
                      <p className="barCode" style={{ margin: "-6.5px 0px 0px 0px", height: 15, textAlign: "center", padding: '0px', font: `${saleUnitPrice.length <= 15 ? style.font : (style.font - 2)}px monospace`, color: "black" }}>{value !== 0 && value !== 1 ? `${saleUnitPrice}đ` : ""}</p>
                    </div></Col>)
                }
                return cols.concat(arr)
              }
            }
            )
          }
        </Row>
      </div>
    );
  }
}

export default PrintComponent;