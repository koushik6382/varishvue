import Papa from "papaparse";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";
import toast from "@/utils/toast";
import type { HtmlPDFOptions, PageOptions } from "./PageOption";
import axios from '../../../services/http-common'
import html2canvas from 'html2canvas'

const baseurl = axios.defaults?.baseURL!.replace("/api/", "/");

var docs: any = null;
const csvHeader = (row: any, header: any) => {
  let obj: any = {};
  return row.map((item: any) => {
    for (var key in item) {
      header.forEach((x: any) => {
        if (x.value === key) {
          item[x.text] = item[key];
          if (x.value === key) {
            //delete item[key];
          }
        }
      });
    }
    return item;
  })
    .map((el: any) => {
      header.forEach((x: any) => {
        if(x?.format){
          obj[x.text] = x.format(el[`${x.text}`]);
        }
        else{
          obj[x.text] = el[`${x.text}`];
        }
        
      });
      return JSON.parse(JSON.stringify(obj));
    });
};
const downloadCsv = (columns: any, items: any, name: any) => {
  if (items.length <= 0) {
    toast.warning("No Data Available");
  } else {
    var csv = Papa.unparse(csvHeader(items, columns));
    var csvData = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    var csvURL = window.URL.createObjectURL(csvData);
    var generateDate = new Date().toLocaleString();

    var testLink = document.createElement("a");
    testLink.href = csvURL;
    testLink.setAttribute("download", `${name + "_" + generateDate}.csv`);
    testLink.click();
  }
};

const setPdf = (columnList: any[], items: any, isQR: boolean, inputQR: any, pageOption?: PageOptions) => {
  return new Promise(async (resolve, reject) => {
    try {
      var columns: any[] = changeColumnList(columnList);
      var qrIndex = columns.indexOf(columns.find(x => x.dataKey === 'qr'));
      getItemsWithQR(columns, items, isQR, inputQR).then((val: any) => {
        docs = new jsPDF({
          orientation: pageOption?.orientation ? pageOption?.orientation : "landscape",
          unit: pageOption?.unit ? pageOption?.unit : "in",
          format: pageOption?.format ? pageOption?.format : "a4",
        });

        autoTable(docs, {
          theme: "grid",
          columns,
          body: val,
          headStyles: {
            fontSize: 7,
            fillColor: [22, 78, 99],
            lineWidth: 0.01,
            lineColor: [22, 78, 99],
          },
          styles: {
            fontSize: 7,
            lineWidth: 0.01,
            lineColor: [0, 0, 0],
          },
          showHead: "firstPage",
          columnStyles: {
            [qrIndex]: {
              minCellHeight: isQR === true ? 1 : 0,
              cellWidth: isQR === true ? 1 : 0,
            },
          },
          margin: { left: 0.5, top: 0.5 },
          didDrawCell: didDrawCell,
        });

        const pageCount = docs.internal.getNumberOfPages();
        for (var z = 1; z <= pageCount; z++) {
          docs.setPage(z);
          const pageSize = docs.internal.pageSize;
          const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
          const pageHeight = pageSize.height
            ? pageSize.height
            : pageSize.getHeight();
          const footer = `Page ${z} of ${pageCount}`;
          docs.setFontSize(10);
          docs.text(
            footer,
            pageWidth / 2 - docs.getTextWidth(footer) / 2,
            pageHeight - 0.2,
            { baseline: "bottom" }
          );
        }
      }).catch((error) => {
        console.log(error);
      });

      resolve(docs);
    } catch (error) {
      reject();
      console.log(error);
    }
  })
};

const printHtmlWithTable = (columnList: any[], items: any, isQR: boolean, inputQR: any, pageOption?: PageOptions,refcontent? : any, htmlPDFOptions? : HtmlPDFOptions) => {
  return new Promise(async (resolve, reject) => {
    try {
      var columns: any[] = changeColumnList(columnList);
      var qrIndex = columns.indexOf(columns.find(x => x.dataKey === 'qr'));

      var htmlOption : HtmlPDFOptions = htmlPDFOptions ? htmlPDFOptions : {scale : 0.60,x : 35,y : 0,startY : 160} 

      getItemsWithQR(columns, items, isQR, inputQR).then((val: any) => {
        docs = new jsPDF({
          orientation: pageOption?.orientation ? pageOption?.orientation : "landscape",
          unit: pageOption?.unit ? pageOption?.unit : "pt",
          format: pageOption?.format ? pageOption?.format : "a4",
        });

        if(refcontent){
          docs.html(refcontent!, {
            html2canvas: {
              scale: htmlOption.scale,
              width: docs.internal.pageSize.getWidth(),
              allowTaint: true,
              useCORS: true,
              proxy: baseurl
            },
            callback: function (docs : any) {
              docs.addImage(refcontent.toDataURL("image/jpeg"), 'JPEG', 0, 0, 100, 100);
              docs.autoPrint();
              docs.output("dataurlnewwindow");

            },
            margin: [5, 5, 5, 5],
            x: htmlOption.x,
            y: htmlOption.y,
            
          });
        }
        

        autoTable(docs, {
          theme: "grid",
          columns,
          body: val,
          headStyles: {
            fontSize: 7,
            fillColor: [22, 78, 99],
            lineWidth: 0.01,
            lineColor: [22, 78, 99],
          },
          styles: {
            fontSize: 7,
            lineWidth: 0.01,
            lineColor: [0, 0, 0],
          },
          showHead: "firstPage",
          startY: refcontent ? docs.pageCount > 1 ? docs.autoTableEndPosY() + 20 : htmlOption.startY : null,
          columnStyles: {
            [qrIndex]: {
              minCellHeight: isQR === true ? 1 : 0,
              cellWidth: isQR === true ? 1 : 0,
            },
          },
          margin: { left: 40 },
          didDrawCell: didDrawCell,
        });

        const pageCount = docs.internal.getNumberOfPages();
        for (var z = 1; z <= pageCount; z++) {
          docs.setPage(z);
          const pageSize = docs.internal.pageSize;
          const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
          const pageHeight = pageSize.height
            ? pageSize.height
            : pageSize.getHeight();
          const footer = `Page ${z} of ${pageCount}`;
          docs.setFontSize(10);
          docs.text(
            footer,
            pageWidth / 2 - docs.getTextWidth(footer) / 2,
            pageHeight - 0.2,
            { baseline: "bottom" }
          );
        }
      }).catch((error) => {
        console.log(error);
      });

      resolve(docs);
    } catch (error) {
      reject();
      console.log(error);
    }
  })
};

const downloadHtmlWithTable = (columnList: any[], items: any, isQR: boolean, inputQR: any, pageOption?: PageOptions,refcontent? : any,title? : string, htmlPDFOptions? : HtmlPDFOptions) => {
  return new Promise(async (resolve, reject) => {
    try {
      var columns: any[] = changeColumnList(columnList);
      var qrIndex = columns.indexOf(columns.find(x => x.dataKey === 'qr'));
      var htmlOption : HtmlPDFOptions = htmlPDFOptions ? htmlPDFOptions : {scale : 0.60,x : 35,y : 0,startY : 160} 
      getItemsWithQR(columns, items, isQR, inputQR).then((val: any) => {
        docs = new jsPDF({
          orientation: pageOption?.orientation ? pageOption?.orientation : "landscape",
          unit: pageOption?.unit ? pageOption?.unit : "pt",
          format: pageOption?.format ? pageOption?.format : "a4",
        });

          var generateDate = new Date().toLocaleString();
          var defaultTtitle : string = title ? title : "export"
          docs.html(refcontent!, {
            html2canvas: {
              scale: htmlOption.scale,
              width: docs.internal.pageSize.getWidth(),
              allowTaint: true,
              useCORS: true,
              proxy: baseurl
            },
            callback: function (docs : any) {
              docs.save(`${defaultTtitle + "_" + generateDate}.pdf`);
            },
            margin: [5, 5, 5, 5],
            x: htmlOption.x,
            y: htmlOption.y,
          
          });

        autoTable(docs, {
          theme: "grid",
          columns,
          body: val,
          headStyles: {
            fontSize: 7,
            fillColor: [22, 78, 99],
            lineWidth: 0.01,
            lineColor: [22, 78, 99],
          },
          styles: {
            fontSize: 7,
            lineWidth: 0.01,
            lineColor: [0, 0, 0],
          },
          showHead: "firstPage",
          startY: refcontent ? docs.pageCount > 1 ? docs.autoTableEndPosY() + 20 : htmlOption.startY : null,
          columnStyles: {
            [qrIndex]: {
              minCellHeight: isQR === true ? 1 : 0,
              cellWidth: isQR === true ? 1 : 0,
            },
          },
          margin: { left: 40 },
          didDrawCell: didDrawCell,
        });

        const pageCount = docs.internal.getNumberOfPages();
        for (var z = 1; z <= pageCount; z++) {
          docs.setPage(z);
          const pageSize = docs.internal.pageSize;
          const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
          const pageHeight = pageSize.height
            ? pageSize.height
            : pageSize.getHeight();
          const footer = `Page ${z} of ${pageCount}`;
          docs.setFontSize(10);
          docs.text(
            footer,
            pageWidth / 2 - docs.getTextWidth(footer) / 2,
            pageHeight - 0.2,
            { baseline: "bottom" }
          );
        }
      }).catch((error) => {
        console.log(error);
      });

      resolve(docs);
    } catch (error) {
      reject();
      console.log(error);
    }
  })
};

const htmlToPdf = (refcontent? : any,isPrint? : boolean, pageOption?: PageOptions,filename?: string) =>{
  return new Promise(async (resolve, reject) => {
    try {
  console.log('refcontent',refcontent);

  var doc = new jsPDF({
    orientation: pageOption?.orientation ? pageOption?.orientation : "landscape",
    unit: pageOption?.unit ? pageOption?.unit : "pt",
    format: pageOption?.format ? pageOption?.format : "a4",
  });

  if(refcontent){
    
    html2canvas(refcontent!).then((canvas)=>{
      var img = canvas.toDataURL("image/png");

      const imgProps= doc.getImageProperties(img);
      var width = doc.internal.pageSize.getWidth();
      var height = (imgProps.height * width) / imgProps.width;   
      
      doc.addImage(img,'JPEG',0,20, width-20, height);

      const pageCount = doc.internal.getNumberOfPages();
      for (var z = 1; z <= pageCount; z++) {
        doc.setPage(z);
        const pageSize = doc.internal.pageSize;
        const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
        const pageHeight = pageSize.height
          ? pageSize.height
          : pageSize.getHeight();
        const footer = `Page ${z} of ${pageCount}`;
        doc.setFontSize(10);
        doc.text(
          footer,
          pageWidth / 2 - doc.getTextWidth(footer) / 2,
          pageHeight - 4,
          { baseline: "bottom" }
        );
      }
  
      if(isPrint){
        doc.autoPrint();
        doc.output("dataurlnewwindow");
      }else{
        var generateDate = new Date().toLocaleString();
        doc.save(`${filename + "_" + generateDate}.pdf`);
      }
      
  });
  }

  resolve(doc);
} catch (error) {
  reject();
  console.log("htmlToPdf error",error);
}
})
}

const printHtmlWithoutTable = (refcontent? : any,pageOption?: PageOptions, htmlPDFOptions? : HtmlPDFOptions) => {
  return new Promise(async (resolve, reject) => {
    try {
     
      var htmlOption : HtmlPDFOptions = htmlPDFOptions ? htmlPDFOptions : {scale : 0.60,x : 35,y : 0,startY : 160} 

      docs = new jsPDF({
        orientation: pageOption?.orientation ? pageOption?.orientation : "landscape",
        unit: pageOption?.unit ? pageOption?.unit : "pt",
        format: pageOption?.format ? pageOption?.format : "a4",
      });

      if(refcontent){
        // refcontent.style.color = "#000000"
        refcontent.style.color = "#000000";
        console.log('refcontent',refcontent);
        docs.html(refcontent!, {
          html2canvas: {
            scale: htmlOption.scale,
            width: docs.internal.pageSize.getWidth(),
            allowTaint: true,
            useCORS: true,
            proxy: baseurl
          },
          callback: function (docs : any) {
            docs.autoPrint();
            docs.output("dataurlnewwindow");
          },
          margin: [5, 5, 5, 5],
          x: htmlOption.x,
          y: htmlOption.y,
          
        });
      }

      const pageCount = docs.internal.getNumberOfPages();
      for (var z = 1; z <= pageCount; z++) {
        docs.setPage(z);
        const pageSize = docs.internal.pageSize;
        const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
        const pageHeight = pageSize.height
          ? pageSize.height
          : pageSize.getHeight();
        const footer = `Page ${z} of ${pageCount}`;
        docs.setFontSize(10);
        docs.text(
          footer,
          pageWidth / 2 - docs.getTextWidth(footer) / 2,
          pageHeight - 0.2,
          { baseline: "bottom" }
        );
      }

      resolve(docs);
    } catch (error) {
      reject();
      console.log(error);
    }
  })
};

const changeColumnList = (columns: any[]) => {
  return columns.map(({ text: title, value: dataKey, format : format }) => ({
    title,
    dataKey,
    format
  }));
}

const getItemsWithQR = (columns: any, items: any, isQR: boolean, inputQR: any) => {
  return new Promise((resolve, reject) => {
    try {
      let list: any = [];
      let obj: any = {};

      items.forEach(async (el: any) => {

        columns?.forEach((x: any) => {
          if(x?.format){
            obj[x.dataKey] = x.format(el[`${x.dataKey}`]);
          }else{
            obj[x.dataKey] = el[`${x.dataKey}`];
          }
        });

        if (isQR === true) {

          columns?.forEach((x: any) => {
            if(x?.format){
              obj[x.dataKey] = x.format(el[`${x.dataKey}`]);
            }else{
              obj[x.dataKey] = el[`${x.dataKey}`];
            }
          });

          if (typeof inputQR === 'string') {
            obj.qrData = await QRCode.toDataURL(JSON.stringify(el[`${inputQR}`]));
          }
          else {
            var arrangeList: any = inputQR.map((m: any) => {
              if (m.includes(":")) {
                let split = m.split(":");
                return {
                  property: split[0],
                  value: split[1]
                }
              }
              else {
                return {
                  property: m,
                  value: m
                }
              }
            })
            var createQrObj: any = {}
            arrangeList.forEach((f: any) => {
              createQrObj[f.property] = el[`${f.value}`]
            })
            obj.qrData = await QRCode.toDataURL(JSON.stringify(
              createQrObj
            ));
          }
        }
        list.push(JSON.parse(JSON.stringify(obj)));
      });
      resolve(list);
    } catch (error) {
      reject([]);
    }
  });
};

const didDrawCell = (data: any) => {
  if (data.column.dataKey === "qr" && data.cell.section === "body") {
    var dim = data.cell.height - data.cell.padding("vertical");
    var textPos = data.cell;

    if (data.row && data.row.raw && data.row.raw.qrData) {
      docs.addImage(
        data.row.raw.qrData,
        textPos.x + 0.05,
        textPos.y + 0.04,
        dim,
        dim
      );
    }
  }
};
const printPdf = async (columns: any, items: any, isQR: boolean, QRData: any, pageOption?: PageOptions) => {
  if (items.length <= 0) {
    toast.warning("No Data Available");
  } else {
    await setPdf(columns, items, isQR, QRData, pageOption);
    docs.autoPrint();
    docs.output("dataurlnewwindow");
  }
};

const downloadPdf = async (columns: any, items: any, isQR: boolean, QRData: any, name: any, pageOption?: PageOptions) => {
  if (items.length <= 0) {
    toast.warning("No Data Available");
  } else {
    await setPdf(columns, items, isQR, QRData, pageOption);
    var generateDate = new Date().toLocaleString();
    docs.save(`${name + "_" + generateDate}.pdf`);
  }
};

const setPdfWithQR = (items: any) => {
  return new Promise(async (resolve: any, reject: any) => {
    try {
      docs = new jsPDF({
        orientation: "portrait",
        unit: "in",
        format: "a4",
      });

      for (var j = 0; j < items.length; j++) {
        var imgData = "../../../assets/images/pl_logo2.png";
        docs.addImage(imgData, "JPEG", 0.5, 0.5, 2.5, 1.5);

        docs.setLineWidth(0.01).line(0.5, 2.2, 8.0, 2.2);

        docs.setFontSize(14).text("Deliver To :", 0.5, 2.5);

        docs.setFontSize(12).text("PHARMATEC PTE LTD", 0.7, 2.7);
        docs.setFontSize(12).text("62 Bank St,", 0.7, 2.9);
        docs.setFontSize(12).text("P.O.Box 450,Ba,", 0.7, 3.1);
        docs.setFontSize(12).text("Fiji Islands", 0.7, 3.3);
        docs.setFontSize(12).text("Ph: 6674933", 0.7, 3.5);
        docs.setFontSize(12).text("Fax: 6670118", 0.7, 3.7);
        docs.setFontSize(12).text("Email: admin@pharmatec.com.fj", 0.7, 3.9);

        //trading partner
        docs.setFontSize(14).text("Trading Partner :", 5, 2.5);

        var qrCanvas: any = document.getElementById(`fieldNoQR-${items[j].fieldNo}`);
        docs.setFontSize(12).text("QR Code", 0.7, 4.5);
        if (qrCanvas) {
          docs.addImage(qrCanvas.toDataURL(), "JPEG", 0.7, 4.7, 0.75, 0.75);
        }

        docs.setFontSize(12).text("Number: " + items[j].fieldNo, 4.0, 4.5);
        if (j < items.length - 1) {
          docs.addPage();
        }

        const pageCount = docs.internal.getNumberOfPages();
        for (var z = 1; z <= pageCount; z++) {
          docs.setPage(z);
          // this.docs.text("Page "+String(i)+" of "+String(pageCount), 0.5,0.5);

          const pageSize = docs.internal.pageSize;
          const pageWidth = pageSize.width
            ? pageSize.width
            : pageSize.getWidth();
          const pageHeight = pageSize.height
            ? pageSize.height
            : pageSize.getHeight();
          // const header = 'Report 2014';
          const footer = `Page ${z} of ${String(pageCount)}`;
          docs.setFontSize(10);
          docs.text(
            footer,
            pageWidth / 2 - docs.getTextWidth(footer) / 2,
            pageHeight - 0.2,
            { baseline: "bottom" }
          );
        }
      }

      resolve();
    } catch (error) {
      reject();
      console.log(error);
    }
  });
};
const printPdfWithQR = (items: any) => {
  if (items.length <= 0) {
    toast.warning("No Data Available");
  } else {
    setPdfWithQR(items);
    docs.autoPrint();
    docs.output("dataurlnewwindow");
  }
};

const downloadPdfWithQR = (items: any, name: any) => {
  if (items.length <= 0) {
    toast.warning("No Data Available");
  } else {
    setPdfWithQR(items);
    var generateDate = new Date().toLocaleString();
    docs.save(`${name + generateDate}.pdf`);
  }
};

export default {
  downloadCsv,
  printPdf,
  downloadPdf,
  printPdfWithQR,
  downloadPdfWithQR,
  printHtmlWithTable,
  downloadHtmlWithTable,
  printHtmlWithoutTable,
  htmlToPdf
};
