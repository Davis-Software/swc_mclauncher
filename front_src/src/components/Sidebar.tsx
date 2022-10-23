import React from "react";
import {
    Divider,
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar
} from "@mui/material";
import pageMapping, { pageMappingInterface} from "../pages/pageMapping";
import {general} from "../utils/constants";

const drawerWidth = 300;

interface SidebarProps {
    page: string;
    pageChange: (page: string) => void;
    modPacks: pageMappingInterface | null;
    disableSidebar?: boolean;
}
function Sidebar(props: SidebarProps) {
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
                    >
                        <ListItemText primary={props.modPacks![key].name} />
                    </ListItemButton>
                ))}
            </List>
        </Drawer>
    )
}

export default Sidebar;
