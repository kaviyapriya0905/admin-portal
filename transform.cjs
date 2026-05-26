const fs = require('fs');
const path = require('path');

const files = [
  'PoojaSevas.tsx',
  'RentalVenue.tsx',
  'Assets.tsx',
  'Campaigns.tsx',
  'EventsCalendar.tsx'
];

const paths = {
  'PoojaSevas.tsx': 'pooja-sevas',
  'RentalVenue.tsx': 'rental-venue',
  'Assets.tsx': 'assets',
  'Campaigns.tsx': 'campaigns',
  'EventsCalendar.tsx': 'events'
};

files.forEach(file => {
  const fullPath = path.join('src/pages/apps/temple-management', file);
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // 1. Add useNavigate if not present, and remove CommonDataModal import
  if (!content.includes('import { useNavigate } from "react-router-dom";')) {
     content = content.replace(/import CommonDataModal, \{[\s\S]*?\} from "\.\.\/\.\.\/\.\.\/components\/common\/CommonDataModal";/, 'import { useNavigate } from "react-router-dom";');
  } else {
     content = content.replace(/import CommonDataModal, \{[\s\S]*?\} from "\.\.\/\.\.\/\.\.\/components\/common\/CommonDataModal";\n/, '');
  }

  // 2. Add const navigate = useNavigate(); inside the component
  if (!content.includes('const navigate = useNavigate();')) {
     content = content.replace(/const (PoojaSevas|RentalVenue|Assets|Campaigns|EventsCalendar): React\.FC = \(\) => \{/, 'const $1: React.FC = () => {\n  const navigate = useNavigate();');
  }

  // 3. Remove modalConfig state
  content = content.replace(/const \[modalConfig, setModalConfig\] = useState<\{[\s\S]*?\}\>\(\{ isOpen: false, data: null \}\);\n/, '');

  // 4. Replace Add button clicks
  content = content.replace(/setModalConfig\(\{ isOpen: true, data: null \}\)/g, `navigate("/${paths[file]}/add")`);
  
  // Custom for pooja sevas & events
  content = content.replace(/setModalConfig\(\{\s*isOpen: true,\s*data: \{[\s\S]*?\}\s*\}\)/g, `navigate("/${paths[file]}/add")`);

  // 5. Replace Edit button clicks
  // This is trickier since variable names differ (item, evt, camp, etc.)
  content = content.replace(/setModalConfig\(\{ isOpen: true, data: ([a-zA-Z0-9_]+) \}\)/g, `navigate(\`/${paths[file]}/edit/\${$1.id}\`)`);
  // Special case for onEdit={(item) => setModalConfig({ isOpen: true, data: item })} in CommonDataTable
  content = content.replace(/onEdit=\{[\s\S]*?\}/, `onEdit={\n            canManage\n              ? (item) => navigate(\`/${paths[file]}/edit/\${item.id}\`)\n              : undefined\n          }`);


  // 6. Remove <CommonDataModal ... /> block entirely
  content = content.replace(/<CommonDataModal[\s\S]*?\/>\n/, '');

  fs.writeFileSync(fullPath, content);
  console.log('Processed', file);
});
