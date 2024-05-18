import { Menu } from '@mui/material'
import React from 'react'

const FileMenu = ({anchorE1}) => {
  return (
    <Menu    anchorEl={anchorE1} open={false} >

        <div  
        style={{
            width:"10rem",
        }}
        >
Lorem ipsum dolor sit amet consectetur adipisicing elit.
 Minus cumque veniam harum magni totam soluta dicta eaque
  omnis distinctio natus labore deleniti ut voluptatum eum 
  quas, iusto saepe consectetur magnam?
        </div>
    </Menu>
  )
}

export default FileMenu
