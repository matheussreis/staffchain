import { useLocation, useParams } from 'react-router';
import { useEffect, useState } from 'react';

export default function useEditPageCheck(firstPathPart) {
  let location = useLocation();
  const params = useParams();

  const [isEdit, setIsEdit] = useState();

  useEffect(() => {
    const path = location.pathname;
    const hasId = 'id' in params;

    let isEdit =
      path.startsWith(`/${firstPathPart}/`) && path.endsWith('/edit');

    if (hasId) {
      isEdit = isEdit && `/${firstPathPart}/edit` !== path;
    }

    setIsEdit(isEdit);
  }, [firstPathPart, params, location]);

  return isEdit;
}
