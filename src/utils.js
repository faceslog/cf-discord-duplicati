function convertSize(num) {

    num = parseInt(num);
    const units = ["", "Ki", "Mi", "Gi", "Ti", "Pi", "Ei", "Zi"];
  
    for (let i = 0; i < units.length; i++) {
      
      if (Math.abs(num) < 1024.0) {
        return `${num.toFixed(1)}${units[i]}B`;
      }
      num /= 1024.0;
    }
  
    return `${num.toFixed(1)}YiB`;
}

function convertTime(timeStr) {

    timeStr = timeStr.split(':');

    let duration = '';

    if (timeStr[0] != '00') {
        duration += `${duration} ${timeStr[0]} Hrs `
    }
        
    if(timeStr[1] != '00') {
        duration += `${duration} ${timeStr[1]} Mins `
    }

    if(timeStr[2] != '00') {
        seconds = Math.round(timeStr[2]);
        duration = `${duration} ${seconds} Secs`;
    }

    return duration;
}

function getColor(parsedResultStr) {
    
    let color = {}
    color['Success'] = 0x7CFC00;
    color['Unknown'] = 0x909090;
    color['Warning'] = 0xFFBF00;
    color['Error'] = 0xFF0000;
    color['FATAL'] = 0xFF0000;

    return color[parsedResultStr];
}

function getIcon(parsedResultStr) {
    
    let icon = {}
    icon['Success'] = ':white_check_mark:';
    icon['Warning'] = ':warning:';
    icon['Error'] = ':no_entry:';
    icon['Uknown'] = ':grey_question:';
    icon['FATAL'] = ':fire:';

    return icon[parsedResultStr];
}

export function createEmbed(name, data) {

    if (!data.hasOwnProperty('ParsedResult')) {

        let embed = {
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
        }

        return embed;
    }

   const icon = getIcon(data.ParsedResult);

    let embed = {
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
                        value: new Date(data.BeginTime).toUTCString(),
                        inline: false
                    },
                    {
                        name: "Time Taken",
                        value: convertTime(data.Duration),
                        inline: false
                    },
                    {
                        name: "No. Files",
                        value: data.ExaminedFiles,
                        inline: true
                    },
                    {
                        name: "Added Files",
                        value: data.AddedFiles,
                        inline: true
                    },
                    {
                        name: "Modified Files",
                        value: data.ModifiedFiles,
                        inline: true
                    },
                    {
                        name: "Total Size",
                        value: convertSize(data.SizeOfExaminedFiles),
                        inline: true
                    },
                    {
                        name: "Added Size",
                        value: convertSize(data.SizeOfAddedFiles),
                        inline: true
                    },
                    {
                        name: "Modified Size",
                        value: convertSize(data.SizeOfModifiedFiles),
                        inline: true
                    }
                ]
            }
        ]
    }

    return embed;
}


