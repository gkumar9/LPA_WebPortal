import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TreeView from "@material-ui/lab/TreeView";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import TreeItem from "@material-ui/lab/TreeItem";
import FolderIcon from "@material-ui/icons/Folder";

const useTreeItemStyles = makeStyles(theme => ({
  content: {
    flexDirection: "row-reverse",
    padding: "0.5em 1em"
  },
  labelRoot: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0.5, 0)
  },
  labelIcon: {
    marginRight: theme.spacing(1)
  },
  labelText: {
    fontWeight: "inherit",
    flexGrow: 1
  }
}));

function StyledTreeItem(props) {
  const classes = useTreeItemStyles();
  const { labelText, labelIcon: LabelIcon, ...other } = props;

  return (
    <TreeItem
      label={
        <div className={classes.labelRoot}>
          <LabelIcon color="action" className={classes.labelIcon} />
          <Typography variant="body2" className={classes.labelText}>
            {labelText}
          </Typography>
        </div>
      }
      classes={{
        content: classes.content
      }}
      {...other}
    />
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    // height: 216,
    // flexGrow: 1,
    // maxWidth: 230
  }
}));

export default function ControlledTreeView() {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState([]);

  const handleChange = (event, nodes) => {
    setExpanded(nodes);
  };

  return (
    <TreeView
      className={classes.root}
      defaultCollapseIcon={<ExpandLessIcon />}
      defaultExpandIcon={<ExpandMoreIcon />}
    //   expanded={expanded}
      defaultExpanded={['1','4','3']}
      onNodeToggle={handleChange}
    >
      <StyledTreeItem nodeId="1" labelText="RSMSSB" labelIcon={FolderIcon}>
        <StyledTreeItem nodeId="2" labelText="Science" labelIcon={FolderIcon} />
        <StyledTreeItem
          nodeId="3"
          labelText="Mathematics"
          labelIcon={FolderIcon}
        >
          <StyledTreeItem nodeId="4" labelText="Alegbra" labelIcon={FolderIcon}>
            <StyledTreeItem
              nodeId="5"
              labelText="Polynomials"
              labelIcon={FolderIcon}
            ></StyledTreeItem>
            <StyledTreeItem
              nodeId="6"
              labelText="Inequalities"
              labelIcon={FolderIcon}
            />
          </StyledTreeItem>
          <StyledTreeItem
            nodeId="7"
            labelText="Geometry"
            labelIcon={FolderIcon}
          />
        </StyledTreeItem>
        <StyledTreeItem nodeId="8" labelText="English" labelIcon={FolderIcon} />
      </StyledTreeItem>
    </TreeView>
  );
}
