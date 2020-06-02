<?php
include_once 'auto_config.php';
include_once 'auto_template_files_config.php';

// for generate auto model
$variable     = ReadTag('VARIABLE_DECLARE', AUTOMODEL_TEMPALATE_FILE);
$setMethod    = ReadTag('SETMETHOD', AUTOMODEL_TEMPALATE_FILE);
$getMethod    = ReadTag('GETMETHOD', AUTOMODEL_TEMPALATE_FILE);
$saveMethod   = ReadTag('SAVEMETHOD', AUTOMODEL_TEMPALATE_FILE);
$deleteMethod = ReadTag('DELETEMETHOD', AUTOMODEL_TEMPALATE_FILE);
$beginclass   = ReadTag('BEGIN', AUTOMODEL_TEMPALATE_FILE);
$endclass     = ReadTag('END', AUTOMODEL_TEMPALATE_FILE);

$shortcodes = array('variable', 'property', 'model', 'modelpeer');


// for generate auto peer model
$peer_const_variable       = ReadTag('CONST_VARIABLE', AUTOPEERMODEL_TEMPALATE_FILE);
$peer_assign               = ReadTag('ASSIGN_PROPERTY_METHOD', AUTOPEERMODEL_TEMPALATE_FILE);
$peer_do_insert            = ReadTag('DO_INSERT_METHOD', AUTOPEERMODEL_TEMPALATE_FILE);
$peer_do_update            = ReadTag('DO_UPDATE_METHOD', AUTOPEERMODEL_TEMPALATE_FILE);
$peer_do_delete            = ReadTag('DO_DELETE_METHOD', AUTOPEERMODEL_TEMPALATE_FILE);
$peer_get_insert           = ReadTag('GET_INSERTID_METHOD', AUTOPEERMODEL_TEMPALATE_FILE);
$peer_beginclass           = ReadTag('BEGIN', AUTOPEERMODEL_TEMPALATE_FILE);
$peer_endclass             = ReadTag('END', AUTOPEERMODEL_TEMPALATE_FILE);
$peer_property_name_method = ReadTag('PROPERTY_NAME_METHOD', AUTOPEERMODEL_TEMPALATE_FILE);
$peer_col_name_method      = ReadTag('COL_NAME_METHOD', AUTOPEERMODEL_TEMPALATE_FILE);

$peer_retrieve_primary = ReadTag('RETRIEVE_PRIMARY_METHOD', AUTOPEERMODEL_TEMPALATE_FILE);
$peer_retrieve_unique  = ReadTag('RETRIEVE_UNIQUE_METHOD', AUTOPEERMODEL_TEMPALATE_FILE);
$peer_retrieve_column  = ReadTag('RETRIEVE_COLUMNS_METHOD', AUTOPEERMODEL_TEMPALATE_FILE);
$peer_retrieve_all     = ReadTag('RETRIEVE_ALL_METHOD', AUTOPEERMODEL_TEMPALATE_FILE);
$peer_retrieve_count     = ReadTag('RETRIEVE_COUNT_METHOD', AUTOPEERMODEL_TEMPALATE_FILE);

$peer_shortcodes = array('variable_upper', 'property', 'tablename', 'arr_property', 'arr_const', 'property_lower', 'property_FirstUpper', 'auto_table_lower', 'auto_table', 'peermodel');


// for generate auto edit success
$beginEdit = ReadTag('BEGIN', AUTO_EDIT_SUCCESS_TEMPALATE_FILE);
$fieldEdit = ReadTag('FIELD', AUTO_EDIT_SUCCESS_TEMPALATE_FILE);
$endEdit   = ReadTag('END', AUTO_EDIT_SUCCESS_TEMPALATE_FILE);

$edit_shortcodes = array('obj', 'obj_FirstUp', 'property_lower', 'property_FirstUp', 'text_input', 'label');


// for generate auto list success
$beginList    = ReadTag('BEGIN', AUTO_LIST_SUCCESS_TEMPALATE_FILE);
$thfieldList  = ReadTag('TH_TITLE', AUTO_LIST_SUCCESS_TEMPALATE_FILE);
$bodyList     = ReadTag('BODY', AUTO_LIST_SUCCESS_TEMPALATE_FILE);
$propertyList = ReadTag('PROPERTY_VALUE', AUTO_LIST_SUCCESS_TEMPALATE_FILE);
$endList      = ReadTag('END', AUTO_LIST_SUCCESS_TEMPALATE_FILE);

$list_shortcodes = array('list_objs_FirstUp', 'list_objs', 'list_obj', 'property', 'module');


// for generate auto action
$beginAction      = ReadTag('BEGIN', AUTO_ACTION_TEMPALATE_FILE);
$listAction       = ReadTag('EXECUTE_LIST', AUTO_ACTION_TEMPALATE_FILE);
$edit_beginAction = ReadTag('EXECUTE_EDIT_BEGIN', AUTO_ACTION_TEMPALATE_FILE);
$edit_setAction   = ReadTag('EXECUTE_EDIT_SET', AUTO_ACTION_TEMPALATE_FILE);
$edit_saveAction  = ReadTag('EXECUTE_EDIT_SAVE', AUTO_ACTION_TEMPALATE_FILE);
$deleteAction     = ReadTag('EXECUTE_EDIT_DELETE', AUTO_ACTION_TEMPALATE_FILE);

$action_shortcodes = array('obj_FirstUp', 'obj', 'list_objs', 'peer_obj', 'property', 'property_firstUp', 'module');


foreach ($tables as $key => $value)
{
    $tableValue = $tables[$key];

    $model_class_name       = $tableValue['model_class_name'];
    $peer_class_name        = $tableValue['peer_class_name'];
    $model_file_name        = $tableValue['model_file_name'];
    $model_class_name_lower = strtolower($model_class_name);
    $peer_file_name         = $tableValue['peer_file_name'];
    $table_name             = $tableValue['table_name'];
    $table_columns_arr      = $tableValue['table_columns'];
    $unique_key_arr         = $tableValue['unique_key'];
    $primary_key_arr        = $tableValue['primary_key'];
    $retrieveby_columns_arr = $tableValue['retrieveby_columns'];
    $retrieve_all           = $tableValue['retrieve_all'];

    $generate_edit   = $tableValue['generate_edit'];
    $generate_list   = $tableValue['generate_list'];
    $generate_action = $tableValue['generate_action'];
    $generate_module = $tableValue['generate_module'];

    $view_path   = $tableValue['view_path'];
    $view_obj    = $tableValue['view_obj'];
    $action_path = $tableValue['action_path'];

    $list_objs = $tableValue['list_objs'];
    $list_obj  = $tableValue['list_obj'];
    $module    = $tableValue['module'];

    createFolder("models/auto/");
    //generate auto class

    $shortcodeValues = array('', '', $model_class_name, $peer_class_name);

    $fp = fopen("../../models/auto/$model_file_name", 'w');

    fwrite($fp, ParseShortcode($beginclass, $shortcodes, $shortcodeValues));

    foreach ($table_columns_arr as $columnName)
    {
        $shortcodeValues[0] = $columnName;
        $shortcodeValues[1] = convertToProperty($columnName);

        fwrite($fp, ParseShortcode($variable, $shortcodes, $shortcodeValues));
    }

    foreach ($table_columns_arr as $columnName)
    {
        $shortcodeValues[0] = $columnName;
        $shortcodeValues[1] = convertToProperty($columnName);

        fwrite($fp, ParseShortcode($getMethod, $shortcodes, $shortcodeValues));
        fwrite($fp, ParseShortcode($setMethod, $shortcodes, $shortcodeValues));
    }

    fwrite($fp, ParseShortcode($saveMethod, $shortcodes, $shortcodeValues));

    fwrite($fp, ParseShortcode($deleteMethod, $shortcodes, $shortcodeValues));

    fwrite($fp, ParseShortcode($endclass, $shortcodes, $shortcodeValues));

    fclose($fp);

    //generate auto peer class

    $peer_shortcodeValues = array('', '', $table_name, '', '', '', '', strtolower($model_class_name), $model_class_name, $peer_class_name);

    $fp = fopen("../../models/auto/$peer_file_name", 'w');

    fwrite($fp, ParseShortcode($peer_beginclass, $peer_shortcodes, $peer_shortcodeValues));

    foreach ($table_columns_arr as $columnName)
    {
        $peer_shortcodeValues[0] = strtoupper($columnName);
        $peer_shortcodeValues[1] = $columnName;

        fwrite($fp, ParseShortcode($peer_const_variable, $peer_shortcodes, $peer_shortcodeValues));

        $peer_shortcodeValues[3] .= "'" . convertToProperty($columnName) . "', ";
        $peer_shortcodeValues[4] .= $peer_class_name . '::' . strtoupper($columnName) . ', ';
    }
    $peer_shortcodeValues[3] = substr($peer_shortcodeValues[3], 0, strlen($peer_shortcodeValues[3]) - 2);
    fwrite($fp, ParseShortcode($peer_property_name_method, $peer_shortcodes, $peer_shortcodeValues));

    $peer_shortcodeValues[4] = substr($peer_shortcodeValues[4], 0, strlen($peer_shortcodeValues[4]) - 2);
    fwrite($fp, ParseShortcode($peer_col_name_method, $peer_shortcodes, $peer_shortcodeValues));

    fwrite($fp, ParseShortcode($peer_assign, $peer_shortcodes, $peer_shortcodeValues));

    fwrite($fp, ParseShortcode($peer_do_insert, $peer_shortcodes, $peer_shortcodeValues));

    fwrite($fp, ParseShortcode($peer_do_update, $peer_shortcodes, $peer_shortcodeValues));

    fwrite($fp, ParseShortcode($peer_do_delete, $peer_shortcodes, $peer_shortcodeValues));

    fwrite($fp, ParseShortcode($peer_get_insert, $peer_shortcodes, $peer_shortcodeValues));

    //retrieve by primay key
    $count_primary_key_arr = count($primary_key_arr);
    for ($i = 0; $i < $count_primary_key_arr; $i++)
    {
        $peer_shortcodeValues[1] = $primary_key_arr[$i];
        $peer_shortcodeValues[5] = strtolower($primary_key_arr[$i]);
        //$peer_shortcodeValues[6] = ucfirst(strtolower(convertToProperty($primary_key_arr[$i])));
        $peer_shortcodeValues[6] = convertToProperty($primary_key_arr[$i]);

        fwrite($fp, ParseShortcode($peer_retrieve_primary, $peer_shortcodes, $peer_shortcodeValues));
    }


    //retrieve by unique key
    $count_unique_key_arr = count($unique_key_arr);
    for ($i = 0; $i < $count_unique_key_arr; $i++)
    {
        $peer_shortcodeValues[1] = $unique_key_arr[$i];
        $peer_shortcodeValues[5] = strtolower($unique_key_arr[$i]);
        //$peer_shortcodeValues[6] = ucfirst(strtolower(convertToProperty($unique_key_arr[$i])));
        $peer_shortcodeValues[6] = convertToProperty($unique_key_arr[$i]);
        fwrite($fp, ParseShortcode($peer_retrieve_unique, $peer_shortcodes, $peer_shortcodeValues));
    }

    //retrieve by columns name
    $count_retrieveby_columns_arr = count($retrieveby_columns_arr);
    for ($i = 0; $i < $count_retrieveby_columns_arr; $i++)
    {
        $peer_shortcodeValues[1] = $retrieveby_columns_arr[$i];
        $peer_shortcodeValues[5] = strtolower($retrieveby_columns_arr[$i]);

        // $peer_shortcodeValues[6] = ucfirst(strtolower(convertToProperty($retrieveby_columns_arr[$i])));
        $peer_shortcodeValues[6] = convertToProperty($retrieveby_columns_arr[$i]);
        fwrite($fp, ParseShortcode($peer_retrieve_column, $peer_shortcodes, $peer_shortcodeValues));
    }

    //retrieve all
    if ($retrieve_all == true)
    {
        fwrite($fp, ParseShortcode($peer_retrieve_all, $peer_shortcodes, $peer_shortcodeValues));
        
        fwrite($fp, ParseShortcode($peer_retrieve_count, $peer_shortcodes, $peer_shortcodeValues));
    }

    fwrite($fp, ParseShortcode($endclass, $peer_shortcodes, $peer_shortcodeValues));

    fclose($fp);

    if ($generate_module == true)
    {
        createFolder($view_path);
        //generate edit success
        if ($generate_edit == true)
        {
            $shortcodeValues = array($view_obj, ucfirst($view_obj), 'model', 'modelpeer');

            $fp = fopen("../../{$view_path}AutoEditSuccess.php", 'w');

            fwrite($fp, ParseShortcode($beginEdit, $edit_shortcodes, $shortcodeValues));

            foreach ($table_columns_arr as $columnName)
            {
                if ($columnName == 'id')
                {
                    $shortcodeValues[4] = 'hidden';
                    $shortcodeValues[5] = 'display:none;';
                }
                else
                {
                    $shortcodeValues[5] = '';
                    $shortcodeValues[4] = 'text';
                }
                $shortcodeValues[2] = $columnName;
                $shortcodeValues[3] = convertToProperty($columnName);

                fwrite($fp, ParseShortcode($fieldEdit, $edit_shortcodes, $shortcodeValues));
            }

            fwrite($fp, ParseShortcode($endEdit, $edit_shortcodes, $shortcodeValues));

            fclose($fp);
        }


        //generate list success
        if ($generate_list == true)
        {
            $shortcodeValues = array(ucfirst($list_objs), $list_objs, $list_obj, '', $module);

            $fp = fopen("../../{$view_path}AutoListSuccess.php", 'w');

            fwrite($fp, ParseShortcode($beginList, $list_shortcodes, $shortcodeValues));

            foreach ($table_columns_arr as $columnName)
            {
                if ($columnName != 'id')
                {
                    $shortcodeValues[3] = convertToProperty($columnName);

                    fwrite($fp, ParseShortcode($thfieldList, $list_shortcodes, $shortcodeValues));
                }
            }

            fwrite($fp, ParseShortcode($bodyList, $list_shortcodes, $shortcodeValues));

            foreach ($table_columns_arr as $columnName)
            {
                if ($columnName != 'id')
                {
                    $shortcodeValues[3] = convertToProperty($columnName);
                    fwrite($fp, ParseShortcode($propertyList, $list_shortcodes, $shortcodeValues));
                }
            }

            fwrite($fp, ParseShortcode($endList, $list_shortcodes, $shortcodeValues));

            fclose($fp);
        }



        createFolder($action_path);
        //generate action
        if ($generate_action == true)
        {
            $shortcodeValues = array(ucfirst($view_obj), $view_obj, $list_objs, ucfirst($view_obj) . "Peer", '', '', $module);

            $fp = fopen("../../{$action_path}Auto" . ucfirst($view_obj) . "Action.php", 'w');

            fwrite($fp, ParseShortcode($beginAction, $action_shortcodes, $shortcodeValues));

            fwrite($fp, ParseShortcode($listAction, $action_shortcodes, $shortcodeValues));

            fwrite($fp, ParseShortcode($edit_beginAction, $action_shortcodes, $shortcodeValues));

            foreach ($table_columns_arr as $columnName)
            {
                $shortcodeValues[4] = $columnName;
                $shortcodeValues[5] = convertToProperty($columnName);
                if ($columnName != 'id')
                    fwrite($fp, ParseShortcode($edit_setAction, $action_shortcodes, $shortcodeValues));
            }

            fwrite($fp, ParseShortcode($edit_saveAction, $action_shortcodes, $shortcodeValues));

            fwrite($fp, ParseShortcode($deleteAction, $action_shortcodes, $shortcodeValues));

            fclose($fp);
        }
    }
}


echo "All declared models are generated automatically. Please check them again";

function convertToProperty($str)
{
    $arr    = explode('_', $str);
    $strNew = '';
    for ($i = 0; $i < count($arr); $i++)
        $strNew .= ucfirst($arr[$i]);
    return $strNew;
}

function ReadTag($tag, $file)
{
    $handle  = @fopen($file, "r");
    $isStart = false;
    $result  = "";

    if ($handle)
    {
        while (!feof($handle))
        {
            $buffer = fgets($handle, 1000);

            if ("{{{$tag}}}" == trim($buffer))
            {
                $isStart = true;
                continue;
            }

            if ("{{/{$tag}}}" == trim($buffer))
                break;

            if ($isStart)
                $result .= $buffer;
        }
        fclose($handle);
    }

    return $result;
}

function ParseShortcode($str, $shortcodes, $shortcodeValues)
{
    foreach ($shortcodes as $key => $shortcode)
    {
        $str = str_replace("{{{$shortcode}}}", $shortcodeValues[$key], $str);
    }
    return $str;
}

function createFolder($path)
{
    $strNew = '../..';
    $pathArr = explode('/', $path);
    foreach ($pathArr as $sub_path)
    {
        $strNew .= '/' . $sub_path;
        if (!is_dir($strNew))
            mkdir($strNew, 7777);
    }
}

?>