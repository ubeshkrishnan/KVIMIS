import React, {useState, useEffect, useContext} from 'react';
import {DataContext} from '../../context/DataContext';
import {Url} from '../../../Global_Variable/api_link';
import { authenticatedFetch } from '../../../Global_Variable/api_helper';

export const myfetchDataAll = async userLoginData => {
  const response = await authenticatedFetch(
    `${Url}/my_all_ticket?user_id=${userLoginData.user_id}`,
  );
  // console.log('RES', response);
  const resjson = await response.json();
  return resjson;
};
