function convertSize(num: number): string {
    const units = ["", "Ki", "Mi", "Gi", "Ti", "Pi", "Ei", "Zi"];
  
    for (let i = 0; i < units.length; i++) {
      if (Math.abs(num) < 1024.0) {
        return `${num.toFixed(1)}${units[i]}B`;
      }
      num /= 1024.0;
    }
  
    return `${num.toFixed(1)}YiB`;
  }
  
  function convertTime(timeStr: string): string {
    const [hours, minutes, seconds] = timeStr.split(':').map(Number);
    let duration = '';
  
    if (hours !== 0) {
      duration += `${hours} Hrs `;
    }
          
    if (minutes !== 0) {
      duration += `${minutes} Mins `;
    }
  
    if (seconds !== 0) {
      duration += `${Math.round(seconds)} Secs`;
    }
  
    return duration.trim();
  }
  
  type ResultType = 'Success' | 'Unknown' | 'Warning' | 'Error' | 'FATAL';
  
  function getColor(parsedResultStr: ResultType): number {
    const color: Record<ResultType, number> = {
      'Success': 0x7CFC00,
      'Unknown': 0x909090,
      'Warning': 0xFFBF00,
      'Error': 0xFF0000,
      'FATAL': 0xFF0000
    };
  
    return color[parsedResultStr];
  }
  
  function getIcon(parsedResultStr: ResultType): string {
    const icon: Record<ResultType, string> = {
      'Success': ':white_check_mark:',
      'Warning': ':warning:',
      'Error': ':no_entry:',
      'Unknown': ':grey_question:',
      'FATAL': ':fire:'
    };
  
    return icon[parsedResultStr];
  }
  
  interface DuplicatiData {
    ParsedResult?: ResultType;
    MainOperation?: string;
    BeginTime?: string;
    Duration?: string;
    ExaminedFiles?: number;
    AddedFiles?: number;
    ModifiedFiles?: number;
    SizeOfExaminedFiles?: number;
    SizeOfAddedFiles?: number;
    SizeOfModifiedFiles?: number;
  }
  
  interface DiscordEmbed {
    embeds: {
      title: string;
      description: string;
      color: number;
      author: {
        name: string;
        url: string;
      };
      footer: {
        text: string;
      };
      fields?: {
        name: string;
        value: string | number;
        inline?: boolean;
      }[];
    }[];
  }
  
  export function createEmbed(name: string, data: DuplicatiData): DiscordEmbed {
    if (!data.ParsedResult) {
      return {
        embeds: [
          {
            title: `:fire: ${name} -> FATAL :fire:`,
            description: "No ParsedResult found",
            color: 0xFF0000,
            author: {
              name: "Duplicati Proxy Notifier",
              url: "https://github.com/faceslog/cf-worker-duplicati"
            },
            footer: {
              text: "Duplicati - Cloudflare Proxy Notifier - faceslog.com"
            }
          }
        ]
      };
    }
  
    const icon = getIcon(data.ParsedResult);
  
    return {
      embeds: [
        {
          title: `${icon} ${data.MainOperation}: ${name} -> ${data.ParsedResult} ${icon}`,
          description: "",
          color: getColor(data.ParsedResult),
          author: {
            name: "Duplicati Proxy Notifier",
            url: "https://github.com/faceslog/cf-worker-duplicati"
          },
          footer: {
            text: "Duplicati - Cloudflare Proxy Notifier - faceslog.com",
          },
          fields: [
            {
              name: "Started",
              value: data.BeginTime ? new Date(data.BeginTime).toUTCString() : 'N/A',
              inline: false
            },
            {
              name: "Time Taken",
              value: data.Duration ? convertTime(data.Duration) : 'N/A',
              inline: false
            },
            {
              name: "No. Files",
              value: data.ExaminedFiles ?? 'N/A',
              inline: true
            },
            {
              name: "Added Files",
              value: data.AddedFiles ?? 'N/A',
              inline: true
            },
            {
              name: "Modified Files",
              value: data.ModifiedFiles ?? 'N/A',
              inline: true
            },
            {
              name: "Total Size",
              value: data.SizeOfExaminedFiles ? convertSize(data.SizeOfExaminedFiles) : 'N/A',
              inline: true
            },
            {
              name: "Added Size",
              value: data.SizeOfAddedFiles ? convertSize(data.SizeOfAddedFiles) : 'N/A',
              inline: true
            },
            {
              name: "Modified Size",
              value: data.SizeOfModifiedFiles ? convertSize(data.SizeOfModifiedFiles) : 'N/A',
              inline: true
            }
          ]
        }
      ]
    };
  }