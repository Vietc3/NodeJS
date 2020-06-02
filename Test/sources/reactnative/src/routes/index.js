import React from "react";
import { Root } from "native-base";
import { createDrawerNavigator, createStackNavigator, createAppContainer } from "react-navigation";

import IssueTypeList from "screens/IssueType/IssueType";
import IssueStatusList from "screens/IssueStatus/IssueStatus";
import PriorityList from "screens/Priority/Priority";
import Login from "screens/Login/";
import CreateIssue from "screens/Issue/CreateIssue/CreateIssue";
import IssueManagement from "screens/Issue/IssueManagement/IssueManagement";

import Dashboard from "reference/dashboard/";

import SideBar from "reference/sidebar";
import Header1 from "reference/Header/1";
import Header2 from "reference/Header/2";
import Header3 from "reference/Header/3";
import Header4 from "reference/Header/4";
import Header5 from "reference/Header/5";
import Header6 from "reference/Header/6";
import Header7 from "reference/Header/7";
import Header8 from "reference/Header/8";
import HeaderSpan from "reference/Header/header-span";
import HeaderNoShadow from "reference/Header/header-no-shadow";
import HeaderTransparent from "reference/Header/header-transparent";
import BasicFooter from "reference/footer/basicFooter";
import IconFooter from "reference/footer/iconFooter";
import IconText from "reference/footer/iconText";
import BadgeFooter from "reference/footer/badgeFooter";
import Default from "reference/button/default";
import Outline from "reference/button/outline";
import Rounded from "reference/button/rounded";
import Block from "reference/button/block";
import Full from "reference/button/full";
import Custom from "reference/button/custom";
import Transparent from "reference/button/transparent";
import IconBtn from "reference/button/iconBtn";
import Disabled from "reference/button/disabled";
import LineChart from "reference/chart/LineChart";
import BasicCard from "reference/card/basic";
import NHCardItemBordered from "reference/card/carditem-bordered";
import NHCardItemButton from "reference/card/carditem-button";
import NHCardImage from "reference/card/card-image";
import NHCardShowcase from "reference/card/card-showcase";
import NHCardList from "reference/card/card-list";
import NHCardHeaderAndFooter from "reference/card/card-header-and-footer";
import NHCardTransparent from "reference/card/card-transparent";
import NHCardCustomBorderRadius from "reference/card/card-custom-border-radius";
import BasicFab from "reference/fab/basic";
import MultipleFab from "reference/fab/multiple";
import FixedLabel from "reference/form/fixedLabel";
import InlineLabel from "reference/form/inlineLabel";
import FloatingLabel from "reference/form/floatingLabel";
import PlaceholderLabel from "reference/form/placeholder";
import StackedLabel from "reference/form/stacked";
import RegularInput from "reference/form/regular";
import UnderlineInput from "reference/form/underline";
import RoundedInput from "reference/form/rounded";
import IconInput from "reference/form/iconInput";
import SuccessInput from "reference/form/success";
import ErrorInput from "reference/form/error";
import DisabledInput from "reference/form/disabledInput";
import PickerInput from "reference/form/pickerInput";
import Icons from "reference/icon/icon";
import BasicIcon from "reference/icon/basic";
import StateIcon from "reference/icon/state";
import PlatformSpecificIcon from "reference/icon/platform-specific";
import IconFamily from "reference/icon/icon-family";
import RowNB from "reference/layout/row";
import ColumnNB from "reference/layout/column";
import NestedGrid from "reference/layout/nested";
import CustomRow from "reference/layout/customRow";
import CustomCol from "reference/layout/customCol";
import BasicListSwipe from "reference/listSwipe/basic-list-swipe";
import SwipeRowCustomStyle from "reference/listSwipe/swipe-row-style";
import MultiListSwipe from "reference/listSwipe/multi-list-swipe";
import NHBasicList from "reference/list/basic-list";
import NHListItemSelected from "reference/list/listitem-selected";
import NHListDivider from "reference/list/list-divider";
import NHListSeparator from "reference/list/list-separator";
import NHListHeader from "reference/list/list-headers";
import NHListIcon from "reference/list/list-icon";
import NHListAvatar from "reference/list/list-avatar";
import NHListThumbnail from "reference/list/list-thumbnail";
import NHListItemNoIndent from "reference/list/listitem-noIndent";
import RegularPicker from "reference/picker/regularPicker";
import PickerWithIcon from "reference/picker/picker-with-icon";
import PlaceholderPicker from "reference/picker/placeholderPicker";
import PlaceholderPickerNote from "reference/picker/placeholderPickernote";
import BackButtonPicker from "reference/picker/backButtonPicker";
import PickerTextItemText from "reference/picker/picker-text-itemtext";
import HeaderPicker from "reference/picker/headerPicker";
import HeaderStylePicker from "reference/picker/headerStylePicker";
import CustomHeaderPicker from "reference/picker/customHeaderPicker";
import BasicTab from "reference/tab/basicTab";
import ConfigTab from "reference/tab/configTab";
import ScrollableTab from "reference/tab/scrollableTab";
import BasicSegment from "reference/segment/SegmentHeader";
import SegmentHeaderIcon from "reference/segment/SegmentHeaderIcon";
import BasicToast from "reference/toast/basic-toast";
import ToastDuration from "reference/toast/toast-duration";
import ToastPosition from "reference/toast/toast-position";
import ToastType from "reference/toast/toast-type";
import ToastText from "reference/toast/toast-text";
import ToastButton from "reference/toast/toast-button";
import RegularActionSheet from "reference/actionsheet/regular";
import IconActionSheet from "reference/actionsheet/icon";
import AdvSegment from "reference/segment/segmentTab";
import SimpleDeck from "reference/deckswiper/simple";
import AdvancedDeck from "reference/deckswiper/advanced";
import HeaderNoLeft from "reference/Header/header-noLeft";
import NHCustomRadio from "reference/radio/custom";
import NHDefaultRadio from "reference/radio/default";
import PickerWithIconStyle from "reference/picker/picker-with-iconstyle";
import AccordionDefault from "reference/accordion/accordion-default";
import AccordionIcon from "reference/accordion/accordion-icon";
import AccordionIconStyle from "reference/accordion/accordion-icon-style";
import AccordionHeaderContentStyle from "reference/accordion/accordion-header-content-style";
import AccordionCustomHeaderContent from "reference/accordion/accordion-custom-header-content";
import TextArea from "reference/form/textArea";
import {route_reference} from "routes/reference";

const routes = [
	{ screen: IssueManagement, route: "IssueManagement" },
	{
		name: "Dashboard",
		screen: Dashboard,
		route: "Dashboard",
		icon: "phone-portrait",
		bg: "#C5F442"
	},
	{
		screen: IssueManagement ,
    route: "IssueManagement",
		name: "Issue",
    icon: "phone-portrait",
    style: {
			backgroundColor: "#C5F442"
		}
	},
	{
		screen: CreateIssue ,
    route: "CreateIssue",
		name: "Create Issue",
    icon: "phone-portrait",
    style: {
			backgroundColor: "#C5F442"
		}
	},
	{
		screen: Login ,
    route: "Login",
		name: "Login",
    icon: "phone-portrait",
    style: {
			backgroundColor: "#C5F442"
		}
  },
  {
		screen: IssueTypeList ,
    route: "IssueTypeList",
		name: "Issue Type",
    icon: "phone-portrait",
    style: {
			backgroundColor: "#C5F442"
		}
  },
  {
		screen: IssueStatusList,
    route: "IssueStatusList",
		name: "Issue Status",
    icon: "phone-portrait",
    style: {
			backgroundColor: "#C5F442"
		}
  },
  {
		screen: PriorityList,
    route: "PriorityList",
		name: "Priority",
    icon: "phone-portrait",
    style: {
			backgroundColor: "#C5F442"
		}
	},
	route_reference
];

const removeRoute = routes.slice(1);
var obj = {};
function getRoutes(arr, key){
	arr.map((item)=>{
		if (item.screen) {obj[item[key]] = {screen: item.screen};}
		if (item.views) {getRoutes(item.views, key);}
	});
	return obj;
}

const Drawer = createDrawerNavigator(
	getRoutes(routes, "route"),
	{
    initialRouteName: "IssueTypeList",
    // initialRouteName: routes[0].route,
    contentOptions: {
      activeTintColor: "#e91e63"
    },
    contentComponent: props => <SideBar {...props} routes={removeRoute}/>
  }
);

const AppNavigator = createStackNavigator(
  {
    Drawer: { screen: Drawer },
    Header1: { screen: Header1 },
    Header2: { screen: Header2 },
    Header3: { screen: Header3 },
    Header4: { screen: Header4 },
    Header5: { screen: Header5 },
    Header6: { screen: Header6 },
    Header7: { screen: Header7 },
    Header8: { screen: Header8 },
    HeaderSpan: { screen: HeaderSpan },
    HeaderNoShadow: { screen: HeaderNoShadow },
    HeaderNoLeft: { screen: HeaderNoLeft },
    HeaderTransparent: { screen: HeaderTransparent },

    BasicFooter: { screen: BasicFooter },
    IconFooter: { screen: IconFooter },
    IconText: { screen: IconText },
    BadgeFooter: { screen: BadgeFooter },

    Default: { screen: Default },
    Outline: { screen: Outline },
    Rounded: { screen: Rounded },
    Block: { screen: Block },
    Full: { screen: Full },
    Custom: { screen: Custom },
    Transparent: { screen: Transparent },
    IconBtn: { screen: IconBtn },
    Disabled: { screen: Disabled },

    BasicCard: { screen: BasicCard },
    NHCardItemBordered: { screen: NHCardItemBordered },
    NHCardItemButton: { screen: NHCardItemButton },
    NHCardImage: { screen: NHCardImage },
    NHCardShowcase: { screen: NHCardShowcase },
    NHCardList: { screen: NHCardList },
    NHCardHeaderAndFooter: { screen: NHCardHeaderAndFooter },
    NHCardTransparent: { screen: NHCardTransparent },
    NHCardCustomBorderRadius: { screen: NHCardCustomBorderRadius },

    SimpleDeck: { screen: SimpleDeck },
    AdvancedDeck: { screen: AdvancedDeck },

    BasicFab: { screen: BasicFab },
    MultipleFab: { screen: MultipleFab },

    FixedLabel: { screen: FixedLabel },
    InlineLabel: { screen: InlineLabel },
    FloatingLabel: { screen: FloatingLabel },
    PlaceholderLabel: { screen: PlaceholderLabel },
    StackedLabel: { screen: StackedLabel },
    RegularInput: { screen: RegularInput },
    UnderlineInput: { screen: UnderlineInput },
    RoundedInput: { screen: RoundedInput },
    IconInput: { screen: IconInput },
    SuccessInput: { screen: SuccessInput },
    ErrorInput: { screen: ErrorInput },
    DisabledInput: { screen: DisabledInput },
    PickerInput: { screen: PickerInput },
    TextArea: { screen: TextArea },

    Icons: { screen: Icons },
    BasicIcon: { screen: BasicIcon },
    StateIcon: { screen: StateIcon },
    PlatformSpecificIcon: { screen: PlatformSpecificIcon },
    IconFamily: { screen: IconFamily },

    RowNB: { screen: RowNB },
    ColumnNB: { screen: ColumnNB },
    NestedGrid: { screen: NestedGrid },
    CustomRow: { screen: CustomRow },
    CustomCol: { screen: CustomCol },

    NHBasicList: { screen: NHBasicList },
    NHListItemSelected: { screen: NHListItemSelected },
    NHListDivider: { screen: NHListDivider },
    NHListSeparator: { screen: NHListSeparator },
    NHListHeader: { screen: NHListHeader },
    NHListIcon: { screen: NHListIcon },
    NHListAvatar: { screen: NHListAvatar },
    NHListThumbnail: { screen: NHListThumbnail },
    NHListItemNoIndent: { screen: NHListItemNoIndent },

    BasicListSwipe: { screen: BasicListSwipe },
    SwipeRowCustomStyle: { screen: SwipeRowCustomStyle },
    MultiListSwipe: { screen: MultiListSwipe },

    RegularPicker: { screen: RegularPicker },
    PickerWithIcon: { screen: PickerWithIcon },
    PlaceholderPicker: { screen: PlaceholderPicker },
    PlaceholderPickerNote: { screen: PlaceholderPickerNote },
    BackButtonPicker: { screen: BackButtonPicker },
    PickerTextItemText: { screen: PickerTextItemText },
    HeaderPicker: { screen: HeaderPicker },
    HeaderStylePicker: { screen: HeaderStylePicker },
    CustomHeaderPicker: { screen: CustomHeaderPicker },
    PickerWithIconStyle: { screen: PickerWithIconStyle },

    NHCustomRadio: { screen: NHCustomRadio },
    NHDefaultRadio: { screen: NHDefaultRadio },

    BasicTab: { screen: BasicTab },
    ConfigTab: { screen: ConfigTab },
    ScrollableTab: { screen: ScrollableTab },

    BasicSegment: { screen: BasicSegment },
    AdvSegment: { screen: AdvSegment },
    SegmentHeaderIcon: { screen: SegmentHeaderIcon },

    BasicToast: { screen: BasicToast },
    ToastDuration: { screen: ToastDuration },
    ToastPosition: { screen: ToastPosition },
    ToastType: { screen: ToastType },
    ToastText: { screen: ToastText },
    ToastButton: { screen: ToastButton },

    RegularActionSheet: { screen: RegularActionSheet },
    IconActionSheet: { screen: IconActionSheet },

    AccordionDefault: { screen: AccordionDefault },
    AccordionIcon: { screen: AccordionIcon },
    AccordionIconStyle: { screen: AccordionIconStyle },
    AccordionHeaderContentStyle: { screen: AccordionHeaderContentStyle },
    AccordionCustomHeaderContent: { screen: AccordionCustomHeaderContent },
	  LineChart: {screen: LineChart}
  },
  {
    initialRouteName: "Drawer",
    headerMode: "none"
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default () =>
  <Root>
    <AppContainer />
  </Root>;
