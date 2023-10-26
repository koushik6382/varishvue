import { useAuthUser } from '@/stores/Auth/authUser';
import { PermissionName } from "./permissionName";
import { SuperUser,Admin } from './const';

export const AccessUtil = (policyName: string, name: PermissionName) => {
  const authStore = useAuthUser();

  switch (name) {
    case PermissionName.CREATE: {
      return authStore.getPermission([SuperUser,Admin, `Permissions.${policyName}.Create`])
    }
    case PermissionName.MODIFY: {
      return authStore.getPermission([SuperUser,Admin, `Permissions.${policyName}.Modify`])
    }
    case PermissionName.ARCHIVE: {
      return authStore.getPermission([SuperUser,Admin, `Permissions.${policyName}.Archive`])
    }
    case PermissionName.RESTORE: {
      return authStore.getPermission([SuperUser,Admin, `Permissions.${policyName}.Restore`])
    }
    case PermissionName.UNARCHIVE: {
      return authStore.getPermission([SuperUser,Admin, `Permissions.${policyName}.Unarchive`])
    }
    case PermissionName.DELETE: {
      return authStore.getPermission([SuperUser,Admin, `Permissions.${policyName}.Delete`])
    }

    case PermissionName.UPLOAD_CSV: {
      return authStore.getPermission([SuperUser,Admin, `Permissions.${policyName}.UploadCsv`])
    }
    case PermissionName.READY_TO_PICK: {
      return authStore.getPermission([SuperUser,Admin, `Permissions.${policyName}.ReadyToPick`])
    }
    case PermissionName.GET_ORDER_LINES_TO_PICK: {
      return authStore.getPermission([SuperUser,Admin, `Permissions.${policyName}.GetOrderLinesToPick`])
    }
  }
}


