import {
  checkMultiple,
  requestMultiple,
  RESULTS,
  PermissionStatus,
} from 'react-native-permissions';
import appBaseUrl from '../config/baseUrl';
import { PermissionType } from '../models';

export const getImageURL = (imageName: string, folder = 'img') => {
  return `${appBaseUrl}assets/${folder}/${imageName}`;
};

export const getAssetURLFromPath = (path?: string) => {
  const regex = /[\\/]/;
  let output = path?.split(regex);
  output?.splice(0, 1);
  return `${appBaseUrl}${output?.join('/')}`;
};

export async function checkAndRequestPermission<T extends PermissionType>(
  permissions: T[]
): Promise<Record<T, PermissionStatus>> {
  let statuses: Record<T, PermissionStatus>;
  statuses = await checkMultiple(permissions);
  const deniedPermissionList = (Object.keys(statuses) as T[]).filter(
    (status) => statuses[status] === RESULTS.DENIED
  );
  if (deniedPermissionList.length > 0) {
    const permissionStatus = await requestMultiple(deniedPermissionList);
    statuses = { ...statuses, ...permissionStatus };
  }

  return statuses;
}
