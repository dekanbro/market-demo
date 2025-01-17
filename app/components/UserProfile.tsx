import { useEnsProfile, truncateAddress } from '@/app/hooks/useEnsProfile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { items } from '@/app/data/items';

interface UserProfileProps {
  address?: string;
  showAvatar?: boolean;
  showName?: boolean;
  size?: 'sm' | 'md' | 'lg';
  isAgent?: boolean;
  agentName?: string;
}

export function UserProfile({ 
  address, 
  showAvatar = true, 
  showName = true,
  size = 'md',
  isAgent = false,
  agentName
}: UserProfileProps) {
  const { profile, loading } = useEnsProfile(address);
  const agent = isAgent ? items.find(i => i.id === address) : null;
  
  if (!address || (loading && !isAgent)) return null;

  const displayName = isAgent 
    ? agentName || agent?.title || 'Agent'
    : profile?.name || truncateAddress(address);

  const avatarSize = size === 'sm' ? 'h-6 w-6' : size === 'lg' ? 'h-12 w-12' : 'h-8 w-8';

  return (
    <div className="flex items-center gap-2">
      {showAvatar && (
        <Avatar className={avatarSize}>
          {isAgent ? (
            <AvatarImage src={agent?.image || "/placeholder.svg"} />
          ) : (
            <AvatarImage src={profile?.avatar || undefined} />
          )}
          <AvatarFallback>
            {displayName.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}
      {showName && (
        <span className="font-medium">
          {displayName}
        </span>
      )}
    </div>
  );
} 