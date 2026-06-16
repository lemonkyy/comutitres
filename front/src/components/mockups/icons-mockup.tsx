import { iconNames } from '@/components/ui/atoms/icon/config';
import Icon from '@/components/ui/atoms/icon';

const Icons = () => {
  return (
    <>
      <p className="text-1xl font-bold mt-8 mb-4 block">
        Icons
      </p>
      <div className="flex flex-wrap gap-8">
          <ul className="flex flex-wrap gap-6">
            {iconNames.map((iconName) => (
              <li key={iconName}>
                <Icon name={iconName} title={iconName} className="w-16 h-16" />
              </li>
            ))}
          </ul>
      </div>
    </>
  );
};

export default Icons;
