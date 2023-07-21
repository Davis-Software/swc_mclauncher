import React from "react";
import {
    Divider,
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText, Menu, MenuItem,
    Toolbar
} from "@mui/material";
import pageMapping, {pageMappingInterface} from "../pages/pageMapping";
import {exposedFunctions, general} from "../utils/constants";
import {ModPackType} from "../types/modPackType";

const drawerWidth = 300;

interface SidebarProps {
    page: string;
    pageChange: (page: string) => void;
    modPacks: pageMappingInterface | null;
    disableSidebar?: boolean;
}
function Sidebar(props: SidebarProps) {
    const [anchorPos, setAnchorPos] = React.useState<null | {top: number, left: number}>();
    const [selectedModpack, setSelectedModpack] = React.useState<ModPackType | null>(null);

    function handleOpenInExplorer(){
        if(!selectedModpack) return;
        exposedFunctions("utils").openInExplorer(selectedModpack.id)
        setAnchorPos(null)
    }
    function handleCleanLogFiles(){
        if(!selectedModpack) return;
        exposedFunctions("mc").cleanLogs(selectedModpack.id)
        setAnchorPos(null)
    }
    function handleUninstall(){
        if(!selectedModpack) return;
        exposedFunctions("mc").uninstallModpack(selectedModpack.id)
        setAnchorPos(null)
    }

    return (
        <Drawer
            variant={(pageMapping[props.page] ? (pageMapping[props.page].noSidebar ? "temporary" : "permanent") : "permanent")}
            anchor="left"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
            }}
        >
            <Toolbar>
                <img src={general.applicationIcon} height={32} width={32} alt="" />
                <h6 style={{marginTop: ".7rem", marginLeft: "15px"}}>{general.applicationName}</h6>
            </Toolbar>
            <List className="host-candle">
                {Object.keys(pageMapping).filter(i => !pageMapping[i].hide).map((key, index) => (
                    <ListItemButton
                        disabled={props.disableSidebar}
                        sx={{
                            paddingLeft: props.page === key ? "30px" : "16px",
                            borderLeft: props.page === key ? "4px solid #3f51b5" : "none",
                            transition: "all .2s"
                        }}
                        key={index}
                        onClick={
                            () => {props.pageChange(key)}
                        }
                    >
                        <ListItemIcon>{pageMapping[key].icon}</ListItemIcon>
                        <ListItemText primary={pageMapping[key].name} />
                    </ListItemButton>
                ))}
                <Divider />
                {props.modPacks && Object.keys(props.modPacks).map((key, index) => (
                    <ListItemButton
                        disabled={props.disableSidebar}
                        sx={{
                            paddingLeft: props.page === key ? "30px" : "16px",
                            borderLeft: props.page === key ? "4px solid #3f51b5" : "none",
                            transition: "all .2s"
                        }}
                        key={index}
                        onClick={
                            () => {props.pageChange(key)}
                        }
                        onContextMenu={(e) => {
                            e.preventDefault();
                            setSelectedModpack(props.modPacks![key].data!)
                            setAnchorPos({top: e.clientY, left: e.clientX});
                        }}
                    >
                        <ListItemText primary={props.modPacks![key].name} />
                    </ListItemButton>
                ))}
            </List>
            <Menu
                open={!!anchorPos}
                onClose={() => setAnchorPos(null)}
                anchorPosition={anchorPos!}
                anchorReference="anchorPosition"
            >
                <MenuItem onClick={handleOpenInExplorer}>Open in Explorer</MenuItem>
                <MenuItem onClick={handleCleanLogFiles}>Clear log files</MenuItem>
                <Divider />
                <MenuItem className="text-danger" onClick={handleUninstall}>Uninstall</MenuItem>
            </Menu>
        </Drawer>
    )
}

export default Sidebar;
