
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ChatPlatform from './ChatPlatform';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Community Chat Platform</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          <ChatPlatform />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatModal;
