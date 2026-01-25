import { Link, useLocation } from 'react-router-dom';

const Breadcrumbs = () => {
  const location = useLocation();
  
  const pathMap = {
    '/dashboard': 'Dashboard',
    '/projects': 'Projects',
    '/projects/create': 'Create Project',
    '/tickets': 'Tickets',
    '/tickets/create': 'Create Ticket',
    '/kanban': 'Kanban Board',
    '/analytics': 'Analytics',
  };

  const generateBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter(x => x);
    
    // Check if we're on a detail page (has an ID)
    const isDetailPage = pathnames.length > 1 && 
      pathnames[pathnames.length - 1].match(/^[a-f\d]{24}$/i);
    
    if (isDetailPage) {
      // Remove the ID from breadcrumbs
      pathnames.pop();
      
      // Determine detail type
      const basePath = `/${pathnames.join('/')}`;
      if (basePath === '/projects') {
        return [
          { name: 'Projects', path: '/projects' },
          { name: 'Project Details', path: location.pathname, isLast: true }
        ];
      } else if (basePath === '/tickets') {
        return [
          { name: 'Tickets', path: '/tickets' },
          { name: 'Ticket Details', path: location.pathname, isLast: true }
        ];
      }
    }
    
    // Build breadcrumbs for regular pages
    const breadcrumbs = [{ name: 'Dashboard', path: '/dashboard' }];
    
    let currentPath = '';
    pathnames.forEach((segment, index) => {
      currentPath += `/${segment}`;

      // Avoid adding Dashboard twice when the path is `/dashboard`
      if (currentPath === '/dashboard') {
        breadcrumbs[0].isLast = index === pathnames.length - 1;
        return; // skip pushing duplicate
      }

      const name = pathMap[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1);
      breadcrumbs.push({
        name,
        path: currentPath,
        isLast: index === pathnames.length - 1
      });
    });
    
    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.path} className="flex items-center space-x-2">
          {index > 0 && (
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
          {crumb.isLast ? (
            <span className="font-medium text-primary-600">{crumb.name}</span>
          ) : (
            <Link 
              to={crumb.path} 
              className="hover:text-primary-600 transition"
            >
              {crumb.name}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
