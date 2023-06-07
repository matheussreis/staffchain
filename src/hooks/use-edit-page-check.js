import { useLocation, useParams } from 'react-router';
import { useEffect, useState } from 'react';

export default function useEditPageCheck(firstPathPart) {
  let location = useLocation();
  const { id } = useParams();

  const [isEdit, setIsEdit] = useState();

  useEffect(() => {
    const path = location.pathname;

    const isEdit =
      path.startsWith(`/${firstPathPart}/`) &&
      path.endsWith('/edit') &&
      `/${firstPathPart}/edit` !== path;
    setIsEdit(isEdit);
  }, [firstPathPart, id, location]);

  return isEdit;
}
