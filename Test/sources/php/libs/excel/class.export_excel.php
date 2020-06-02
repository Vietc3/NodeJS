<?php

#### Roshan's very simple code to export data to excel   
#### Copyright reserved to Roshan Bhattarai - nepaliboy007@yahoo.com
#### if you find any problem contact me at http://roshanbh.com.np
#### fell free to visit my blog http://php-ajax-guru.blogspot.com

class ExportExcel
{
	//variable of the class
	var $fileName, $header, $data;
	
	//functions of the class
	function ExportExcel($f_name) //constructor
	{
            $this->fileName=$f_name;
            $this->header = "";
            $this->data = "";
	}
        public function BuildHeader($arrResult, $isArrHasHeader, $isHeaderDate, $arrColHeader = null)
        {
            //Neu da co header thi ko tao nua
            if ($this->header != "")
                    return;
            $this->header = "$colHeader\t";
            if ($isArrHasHeader)
            {
                $arrRowHeader = array_keys($arrResult );            
                $arrColHeader = array_keys($arrResult[$arrRowHeader[0]]);
            }
            //Boi vi mot o du lieu trong excel ma co gia tri la: 11-01 thi excel se hieu la 01 november, trong khi chung ta muon no la nam 2011 thang 1
            if ($isHeaderDate)
                foreach ($arrColHeader as $colHeader )
                    $this->header .= "20$colHeader\t"; 
            else
                foreach ($arrColHeader as $colHeader )
                    $this->header .= "$colHeader\t"; 
        }
        public function BuildData($arrResult, $isArrHasHeader, $isHeaderDate, $arrColHeader = null, $title = null)
        {
            $this->BuildHeader($arrResult, $isArrHasHeader, $isHeaderDate, $arrColHeader);
            
            foreach ($arrResult as $key=>$row)
            {
                $line = "$key\t";
                foreach ($row as $cell)
                {
                    if ( !isset($cell) || ($cell == "") ) 
 			$cell = "\t"; 
                    else 
		    { 
 	         	$cell  = str_replace('"', '""', $cell); 
 			$cell  =  '"' . $cell  . '"' . "\t";                         
                    } 
                    $line .= $cell;                    
                }
                $this->data .= trim($line)."\n";
            }
        }
        public function GenerateExcelFile()
        {            
            $this->data = str_replace("\r", "", $this->data); 
            if ($this->data == "") 
                $this->data = "\n(0) Records Found!\n"; 
            
            header("Content-type: application/vnd.ms-excel"); 
            header("Content-Disposition: attachment; filename=$this->fileName"); 
            header("Pragma: no-cache"); 
            header("Expires: 0"); 
            print chr(255).chr(254).mb_convert_encoding($this->header ."\n". $this->data, 'UTF-16LE', 'UTF-8');
            die();
        }
}
?>