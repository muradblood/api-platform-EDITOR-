import Head from "next/head";
import { useEffect, useState } from "react";
import { resolveEntrypoint } from "../../config/entrypoint";

const Admin = () => {
  // Load the admin client-side
  const [DynamicAdmin, setDynamicAdmin] = useState(<p>Loading...</p>);
  useEffect(() => {
    (async () => {
      const HydraAdmin = (await import("@api-platform/admin")).HydraAdmin;

      setDynamicAdmin(
        <HydraAdmin entrypoint={resolveEntrypoint()}></HydraAdmin>
      );
    })();
  }, []);

  return (
    <>
      <Head>
        <title>API Platform Admin</title>
      </Head>

      {DynamicAdmin}
    </>
  );
};
export default Admin;
