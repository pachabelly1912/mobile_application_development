import ENUMS from '../constants/enums';
import Home from '../components/home';
import Detail from '../components/detail';
import Setting from '../components/setting';
import HistoryGpu from '../components/historyGpu';
export default {
    [ENUMS.SCREEN.HOME]: {
        screen: Home
    },
    [ENUMS.SCREEN.SETTING]: {
        screen: Setting
    },
    [ENUMS.SCREEN.DETAIL]: {
        screen: Detail
    },
    [ENUMS.SCREEN.HISTORY_GPU]: {
        screen: HistoryGpu
    }
}