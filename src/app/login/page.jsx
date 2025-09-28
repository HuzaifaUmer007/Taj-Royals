import AuthForm from '@/components/AuthForm';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function LoginPage() {
  return (
    <ProtectedRoute requireAuth={false} redirectTo="/cart">
      <AuthForm mode="login" />
    </ProtectedRoute>
  );
}