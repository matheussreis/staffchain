import { useLocation } from 'react-router';
import { useEffect, useState } from 'react';

export default function useEditPageCheck(firstPathPart) {
  let location = useLocation();

  const [isEdit, setIsEdit] = useState();

  useEffect(() => {
    const path = location.pathname;
    const isEdit =
      path.startsWith(`/${firstPathPart}/`) && path.endsWith('/edit');
    setIsEdit(isEdit);
  }, [firstPathPart, location]);

  return isEdit;
}
