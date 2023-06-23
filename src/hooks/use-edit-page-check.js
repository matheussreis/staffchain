import { useLocation, useParams } from 'react-router';
import { useEffect, useState } from 'react';

export default function useEditPageCheck() {
  let location = useLocation();
  const params = useParams();

  const [isEdit, setIsEdit] = useState();

  useEffect(() => {
    const path = location.pathname;
    const hasId = 'id' in params;
    const pathParts = path.split('/');
    const firstPathPart = pathParts[1];

    let isEdit =
      path.startsWith(`/${firstPathPart}/`) && path.endsWith('/edit');

    if (hasId) {
      isEdit = isEdit && `/${firstPathPart}/edit` !== path;
    }

    setIsEdit(isEdit);
  }, [params, location]);

  return isEdit;
}
