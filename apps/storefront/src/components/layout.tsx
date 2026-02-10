import ErrorBoundary from "@/components/error-boundary"
import Footer from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { CartProvider } from "@/lib/context/cart"
import { ToastProvider } from "@/lib/context/toast-context"
import { Outlet, useLocation } from "@tanstack/react-router"

const Layout = () => {
  const location = useLocation()
  const isHomepage = location.pathname === "/" || /^\/[a-z]{2}\/?$/.test(location.pathname)
  const isCheckout = location.pathname.includes("/checkout")

  // Checkout has its own layout without navbar/footer
  if (isCheckout) {
    return (
      <ToastProvider>
        <CartProvider>
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </CartProvider>
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <CartProvider>
        <div className={isHomepage ? "" : "min-h-screen flex flex-col"}>
          <Navbar />

          <main className={isHomepage ? "" : "relative flex-1 pt-10"}>
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </main>

          {!isHomepage && <Footer />}
        </div>
      </CartProvider>
    </ToastProvider>
  );
};

export default Layout;
