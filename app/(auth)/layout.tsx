import { Toaster } from "@/components/ui/sonner";

type Props = {
  children: React.ReactNode;
};
const AuthLayout = ({ children }: Props) => {
  return (
    <div>
      {children}
      <Toaster />
    </div>
  );
};

export default AuthLayout;
