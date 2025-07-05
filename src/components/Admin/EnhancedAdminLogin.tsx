
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Eye, EyeOff, Globe, ArrowLeft, UserPlus, KeyRound } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

type Language = 'en' | 'ar';
type Mode = 'login' | 'register' | 'forgot-password';

interface Translations {
  en: {
    title: string;
    subtitle: string;
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    role: string;
    signIn: string;
    signUp: string;
    register: string;
    forgotPassword: string;
    resetPassword: string;
    backToLogin: string;
    signingIn: string;
    registering: string;
    sendingReset: string;
    emailPlaceholder: string;
    passwordPlaceholder: string;
    firstNamePlaceholder: string;
    lastNamePlaceholder: string;
    dontHaveAccount: string;
    haveAccount: string;
    rememberPassword: string;
    createAccount: string;
    resetInstructions: string;
    adminRole: string;
    moderatorRole: string;
    switchLanguage: string;
  };
  ar: {
    title: string;
    subtitle: string;
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    role: string;
    signIn: string;
    signUp: string;
    register: string;
    forgotPassword: string;
    resetPassword: string;
    backToLogin: string;
    signingIn: string;
    registering: string;
    sendingReset: string;
    emailPlaceholder: string;
    passwordPlaceholder: string;
    firstNamePlaceholder: string;
    lastNamePlaceholder: string;
    dontHaveAccount: string;
    haveAccount: string;
    rememberPassword: string;
    createAccount: string;
    resetInstructions: string;
    adminRole: string;
    moderatorRole: string;
    switchLanguage: string;
  };
}

const translations: Translations = {
  en: {
    title: 'OfSpace Admin',
    subtitle: 'Sign in to access the admin dashboard',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    firstName: 'First Name',
    lastName: 'Last Name',
    role: 'Role',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    register: 'Register',
    forgotPassword: 'Forgot Password?',
    resetPassword: 'Reset Password',
    backToLogin: 'Back to Login',
    signingIn: 'Signing in...',
    registering: 'Creating account...',
    sendingReset: 'Sending reset email...',
    emailPlaceholder: 'admin@ofspace.com',
    passwordPlaceholder: 'Enter your password',
    firstNamePlaceholder: 'Enter your first name',
    lastNamePlaceholder: 'Enter your last name',
    dontHaveAccount: "Don't have an account?",
    haveAccount: 'Already have an account?',
    rememberPassword: 'Remember your password?',
    createAccount: 'Create Account',
    resetInstructions: 'Enter your email to receive password reset instructions',
    adminRole: 'Administrator',
    moderatorRole: 'Moderator',
    switchLanguage: 'عربي'
  },
  ar: {
    title: 'إدارة أوف سبيس',
    subtitle: 'سجل دخولك للوصول إلى لوحة الإدارة',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',
    firstName: 'الاسم الأول',
    lastName: 'اسم العائلة',
    role: 'الدور',
    signIn: 'تسجيل الدخول',
    signUp: 'إنشاء حساب',
    register: 'تسجيل',
    forgotPassword: 'نسيت كلمة المرور؟',
    resetPassword: 'إعادة تعيين كلمة المرور',
    backToLogin: 'العودة لتسجيل الدخول',
    signingIn: 'جاري تسجيل الدخول...',
    registering: 'جاري إنشاء الحساب...',
    sendingReset: 'جاري إرسال بريد الإعادة...',
    emailPlaceholder: 'admin@ofspace.com',
    passwordPlaceholder: 'أدخل كلمة المرور',
    firstNamePlaceholder: 'أدخل اسمك الأول',
    lastNamePlaceholder: 'أدخل اسم العائلة',
    dontHaveAccount: 'ليس لديك حساب؟',
    haveAccount: 'لديك حساب بالفعل؟',
    rememberPassword: 'تذكرت كلمة المرور؟',
    createAccount: 'إنشاء حساب',
    resetInstructions: 'أدخل بريدك الإلكتروني لاستلام تعليمات إعادة تعيين كلمة المرور',
    adminRole: 'مدير',
    moderatorRole: 'مشرف',
    switchLanguage: 'English'
  }
};

const EnhancedAdminLogin: React.FC = () => {
  const [language, setLanguage] = useState<Language>('en');
  const [mode, setMode] = useState<Mode>('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: 'admin'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const t = translations[language];
  const isRTL = language === 'ar';

  const validateForm = () => {
    if (!formData.email || !formData.email.includes('@')) {
      toast.error(language === 'en' ? 'Please enter a valid email' : 'يرجى إدخال بريد إلكتروني صحيح');
      return false;
    }

    if (mode !== 'forgot-password') {
      if (!formData.password || formData.password.length < 6) {
        toast.error(language === 'en' ? 'Password must be at least 6 characters' : 'كلمة المرور يجب أن تكون 6 أحرف على الأقل');
        return false;
      }
    }

    if (mode === 'register') {
      if (formData.password !== formData.confirmPassword) {
        toast.error(language === 'en' ? 'Passwords do not match' : 'كلمات المرور غير متطابقة');
        return false;
      }
      if (!formData.firstName.trim() || !formData.lastName.trim()) {
        toast.error(language === 'en' ? 'Please enter your full name' : 'يرجى إدخال اسمك الكامل');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          toast.error(language === 'en' ? error.message : 'خطأ في تسجيل الدخول');
        } else {
          toast.success(language === 'en' ? 'Login successful!' : 'تم تسجيل الدخول بنجاح!');
        }
      } else if (mode === 'register') {
        const redirectUrl = `${window.location.origin}/admin`;
        
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              first_name: formData.firstName,
              last_name: formData.lastName,
              role: formData.role
            }
          }
        });

        if (error) {
          toast.error(language === 'en' ? error.message : 'خطأ في إنشاء الحساب');
        } else {
          toast.success(language === 'en' ? 
            'Account created! Please check your email to confirm.' : 
            'تم إنشاء الحساب! يرجى التحقق من بريدك الإلكتروني للتأكيد.'
          );
          setMode('login');
        }
      } else if (mode === 'forgot-password') {
        const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
          redirectTo: `${window.location.origin}/admin`
        });

        if (error) {
          toast.error(language === 'en' ? error.message : 'خطأ في إرسال بريد الإعادة');
        } else {
          toast.success(language === 'en' ? 
            'Password reset email sent!' : 
            'تم إرسال بريد إعادة تعيين كلمة المرور!'
          );
          setMode('login');
        }
      }
    } catch (error) {
      toast.error(language === 'en' ? 'An unexpected error occurred' : 'حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const switchLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 ${isRTL ? 'rtl' : 'ltr'}`}>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-2xl">🛸</span>
              </div>
              <div>
                <CardTitle className="text-2xl">{t.title}</CardTitle>
                <CardDescription>{mode === 'login' ? t.subtitle : mode === 'register' ? t.createAccount : t.resetInstructions}</CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={switchLanguage}
              className="flex items-center space-x-1"
            >
              <Globe className="w-4 h-4" />
              <span className="text-xs">{t.switchLanguage}</span>
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">{t.email}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t.emailPlaceholder}
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                className={isRTL ? 'text-right' : ''}
              />
            </div>

            {/* Registration Fields */}
            {mode === 'register' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">{t.firstName}</Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder={t.firstNamePlaceholder}
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      required
                      className={isRTL ? 'text-right' : ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">{t.lastName}</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder={t.lastNamePlaceholder}
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      required
                      className={isRTL ? 'text-right' : ''}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">{t.role}</Label>
                  <select
                    id="role"
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="admin">{t.adminRole}</option>
                    <option value="moderator">{t.moderatorRole}</option>
                  </select>
                </div>
              </>
            )}

            {/* Password Fields */}
            {mode !== 'forgot-password' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="password">{t.password}</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder={t.passwordPlaceholder}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      required
                      className={isRTL ? 'text-right pr-10' : 'pr-10'}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                {mode === 'register' && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">{t.confirmPassword}</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder={t.passwordPlaceholder}
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        required
                        className={isRTL ? 'text-right pr-10' : 'pr-10'}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                mode === 'login' ? t.signingIn : 
                mode === 'register' ? t.registering : 
                t.sendingReset
              ) : (
                mode === 'login' ? t.signIn : 
                mode === 'register' ? t.register : 
                t.resetPassword
              )}
            </Button>

            {/* Mode Switching */}
            <div className="space-y-4">
              <Separator />
              
              {mode === 'login' && (
                <div className="space-y-2 text-center">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setMode('forgot-password')}
                    className="text-sm text-muted-foreground"
                  >
                    <KeyRound className="w-4 h-4 mr-1" />
                    {t.forgotPassword}
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    {t.dontHaveAccount}{' '}
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => setMode('register')}
                      className="p-0 h-auto font-medium text-primary"
                    >
                      <UserPlus className="w-4 h-4 mr-1" />
                      {t.signUp}
                    </Button>
                  </div>
                </div>
              )}

              {(mode === 'register' || mode === 'forgot-password') && (
                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setMode('login')}
                    className="text-sm text-muted-foreground"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    {mode === 'register' ? t.haveAccount : t.rememberPassword} {t.backToLogin}
                  </Button>
                </div>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedAdminLogin;
