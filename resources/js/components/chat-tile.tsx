import { SendIcon, SparklesIcon } from 'lucide-react';
import { type FormEvent, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { chat } from '@/routes/ai';

type Message = {
    id: number;
    role: 'user' | 'assistant';
    content: string;
};

function csrfToken(): string {
    const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/);

    return match ? decodeURIComponent(match[1]) : '';
}

export function ChatTile() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [draft, setDraft] = useState('');
    const [pending, setPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const scroller = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scroller.current?.scrollTo({
            top: scroller.current.scrollHeight,
            behavior: 'smooth',
        });
    }, [messages, pending]);

    async function send(event: FormEvent) {
        event.preventDefault();

        const content = draft.trim();

        if (content === '' || pending) {
            return;
        }

        const history: Message[] = [
            ...messages,
            { id: messages.length, role: 'user', content },
        ];

        const replyId = history.length;

        setMessages(history);
        setDraft('');
        setError(null);
        setPending(true);

        try {
            const response = await fetch(chat().url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'text/plain',
                    'X-XSRF-TOKEN': csrfToken(),
                },
                body: JSON.stringify({
                    messages: history.map((message) => ({
                        role: message.role,
                        content: message.content,
                    })),
                }),
            });

            if (!response.ok || response.body === null) {
                throw new Error(
                    `The assistant returned ${response.status} ${response.statusText}`,
                );
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let reply = '';

            while (true) {
                const { done, value } = await reader.read();

                if (done) {
                    break;
                }

                reply += decoder.decode(value, { stream: true });

                setMessages((current) =>
                    current.some((message) => message.id === replyId)
                        ? current.map((message) =>
                              message.id === replyId
                                  ? { ...message, content: reply }
                                  : message,
                          )
                        : [
                              ...current,
                              {
                                  id: replyId,
                                  role: 'assistant',
                                  content: reply,
                              },
                          ],
                );
            }
        } catch (exception) {
            setError(
                exception instanceof Error
                    ? exception.message
                    : 'The assistant could not be reached',
            );
        } finally {
            setPending(false);
        }
    }

    const awaitingFirstChunk = pending && messages.at(-1)?.role === 'user';

    return (
        <Card className="flex h-full flex-1 flex-col gap-4 overflow-hidden">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <SparklesIcon className="size-4 text-muted-foreground" />
                    Assistant
                </CardTitle>
            </CardHeader>
            <CardContent className="flex min-h-0 flex-1 flex-col gap-4">
                <div
                    ref={scroller}
                    className="min-h-0 flex-1 space-y-3 overflow-y-auto"
                >
                    {messages.length === 0 && !pending && (
                        <p className="text-sm text-muted-foreground">
                            Ask something to try the chat.
                        </p>
                    )}
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={cn(
                                'flex',
                                message.role === 'user'
                                    ? 'justify-end'
                                    : 'justify-start',
                            )}
                        >
                            <div
                                className={cn(
                                    'max-w-[80%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap',
                                    message.role === 'user'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted text-foreground',
                                )}
                            >
                                {message.content}
                            </div>
                        </div>
                    ))}
                    {awaitingFirstChunk && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Spinner />
                            Thinking
                        </div>
                    )}
                    {error !== null && (
                        <p className="text-sm text-destructive">{error}</p>
                    )}
                </div>
                <form onSubmit={send} className="flex items-center gap-2">
                    <Input
                        value={draft}
                        onChange={(event) => setDraft(event.target.value)}
                        placeholder="Type a message"
                        autoComplete="off"
                    />
                    <Button
                        type="submit"
                        size="icon"
                        disabled={pending || draft.trim() === ''}
                    >
                        <SendIcon />
                        <span className="sr-only">Send</span>
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
