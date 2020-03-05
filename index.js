import Store from "./Store/index.js";
import BasicAreaBrush from "./components/charts/AreaBrush/models/BasicAreaBrush/index.js"
import BasicBarChart from "./components/charts/BarChart/models/BasicBarChart/index.js"
import BasicPieChart from "./components/charts/PieChart/models/BasicPieChart/index.js"
import ParcelMap from "./components/charts/MapChart/models/ParcelMap/index.js"
import TabsView from "./components/elements/TabsView.js"
import Table from "./components/elements/Table.js"
import DataFetcher from "./components/elements/DataFetcher.js"
import FreeList from "./components/elements/FreeList.js"
import Columns from "./components/elements/Columns/index.js"
import helper from './helper/index.js'


window.df = {
  Store,
  BasicAreaBrush,
  BasicBarChart,
  BasicPieChart,
  ParcelMap,
  TabsView,
  Table,
  DataFetcher,
  FreeList,
  Columns,
  helper
}
