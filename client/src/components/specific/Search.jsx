import { Dialog, DialogTitle, Stack, TextField ,InputAdornment, List} from '@mui/material'
import React, { useState } from 'react'
import { Search as SearchIcon } from "@mui/icons-material";

import { useInputValidation } from "6pp";
import UserItem from '../shared/UserItem';
import { sampleUsers } from '../../constants/sampleData.js';


const Search = () => {

  let isLoadingSendFriendRequest=false;

  const [users,setUsers]=useState(sampleUsers)
  const addFriendHandler=(id)=>{
    console.log(id);
  }
  

const search =useInputValidation("")

  return <Dialog open >  
  <Stack   p={"2rem"} direction={"column"} width={"25rem"}  >
   <DialogTitle textAlign={"center"}>Find People</DialogTitle>
    <TextField label="" value={search.value} onChange={search.changeHandler}
       variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
    
    />

          <List>
            {
              users.map((i)=>(
               <UserItem    
               user={i}
               key={i._id}
               handler={addFriendHandler}
               handlerIsLoading={isLoadingSendFriendRequest}
               />
              ))
            }
          </List>

  </Stack>
  
  </Dialog>
    
  
}

export default Search
