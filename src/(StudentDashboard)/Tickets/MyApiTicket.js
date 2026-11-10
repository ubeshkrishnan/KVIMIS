import {Url} from '../../../Global_Variable/api_link';
import { authenticatedFetch, logError } from '../../../Global_Variable/api_helper';

export const myfetchDataAll = async userLoginData => {
  if (!userLoginData?.user_id) {
    return null;
  }
  try {
    const response = await authenticatedFetch(
      `${Url}/my_all_ticket?user_id=${userLoginData.user_id}`,
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const resjson = await response.json();
    return resjson;
  } catch (error) {
    logError('myfetchDataAll', error);
    return null;
  }
};
