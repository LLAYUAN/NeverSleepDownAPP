import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';

const generateHTML = (courses) => {
//todo获取一下courses的数据
    /*const courses = [
        { date: 1, eventName: '数学', eventLocation: '教室101', courseCode: '47', startTimeNumber: 1, endTimeNumber: 2 },
        { date: 1, eventName: '物理', eventLocation: '教室102', courseCode: '48', startTimeNumber: 3, endTimeNumber: 4 },
        { date: 2, eventName: '化学', eventLocation: '教室103', courseCode: '41229', startTimeNumber: 5, endTimeNumber: 13 },
        { date:3, eventName: '数学', eventLocation: '教室103', courseCode: '41229', startTimeNumber: 5, endTimeNumber: 13 },
        // 添加更多课程
    ];*/

    const dates = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
    const totalPeriods = 13; // 假设一天最多有 13 节课

    // 初始化一个空表
    let table = Array.from({ length: totalPeriods }, () => Array(dates.length).fill(''));

    // 填充课程表
    courses.forEach(course => {
        const dateIndex = course.date-1;
        const startTimeNumberIndex = course.startTimeNumber - 1;
        const endTimeNumberIndex = course.endTimeNumber - 1;
        if (dateIndex > -1 && startTimeNumberIndex > -1 && endTimeNumberIndex > -1 && endTimeNumberIndex < totalPeriods) {
            for (let i = startTimeNumberIndex; i <= endTimeNumberIndex; i++) {
                table[i][dateIndex] = `${course.eventName} <br>${course.courseCode}<br>${course.eventLocation}`;
            }
        }
    });

    // 生成 HTML 表格
    let html = `
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; }
        h1 { color: #007386; text-align: center; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: center; }
        th { background-color: #f2f2f2; }
        td { font-size: 16px; } /* 增大字体 */
      </style>
    </head>
    <body>
      <h1>课表</h1>
      <table>
        <tr>
          <th>节次</th>
          ${dates.map(date => `<th>${date}</th>`).join('')}
        </tr>
  `;

    /*for (let i = 0; i < totalPeriods; i++) {
        html += '<tr>';
        html += `<td>${i + 1}</td>`;
        for (let j = 0; j < dates.length; j++) {
            let rowspan = 1;
            if (table[i][j] !== '') {
                // 检查连续的单元格
                for (let k = i + 1; k < totalPeriods && table[k][j] === table[i][j]; k++) {
                    rowspan++;
                    table[k][j] = ''; // 清空合并的单元格内容
                }
                html += `<td rowspan="${rowspan}">${table[i][j]}</td>`;
            } else {
                html += '<td></td>';
            }
        }
        html += '</tr>';
    }*/

    let visited = Array.from({ length: totalPeriods }, () => Array(dates.length).fill(false));
    for (let i = 0; i < totalPeriods; i++) {
        html += '<tr>';
        html += `<td>${i + 1}</td>`;
        for (let j = 0; j < dates.length; j++) {
            let rowspan = 1;
            if (table[i][j] !== '') {
                // 检查连续的单元格
                for (let k = i + 1; k < totalPeriods && table[k][j] === table[i][j]; k++) {
                    rowspan++;
                    table[k][j] = ''; // 清空合并的单元格内容
                    visited[k][j] = true;
                }
                html += `<td rowspan="${rowspan}">${table[i][j]}</td>`;
            } else {
                if(visited[i][j]===false)
                    html += '<td></td>';
            }
        }
        html += '</tr>';
    }

    html += `
      </table>
    </body>
    </html>
  `;

    return html;
};

const generatePDF = async (courses) => {
    const html = generateHTML(courses);

    let options = {
        html: html,
        fileName: '课表',
        directory: 'Documents',
    };

    let file = await RNHTMLtoPDF.convert(options);
    console.log(file.filePath);
    sharePDF(file.filePath);
};

const sharePDF = (filePath) => {
    const options = {
        url: `file://${filePath}`,
        type: 'application/pdf',
        title: '课表',
        message: '这是您的课表PDF',
    };
    Share.open(options)
        .then((res) => {
            console.log(res);
        })
        .catch((err) => {
            if (err.message !== 'User did not share') {
                // 记录错误或显示给用户，但排除 "User did not share" 错误
                console.error(err);
            } else {
                // 用户取消分享，不记录此错误
            }
        });
        // .catch((err) => {
        //     console.error(err);
        // });
};

export { generatePDF };
