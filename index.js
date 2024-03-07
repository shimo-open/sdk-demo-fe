const {connect, FileType} = window.ShimoJSSDK


// 需要接入方实现：从您的后端服务获取用于石墨鉴权的 signature 和 透传回接入方后端的 token
// const { signature, token } = await getCredentialsFromServer()

// 必填
const signature = '';
const token = '';
const endpointUrl = ''; // 后面要带/sdk/v2，示例：https://your_endpoint.com/sdk/v2
const fileId = '';

// 选填
const myDomain = 'https://xxx.com'; // 您的系统域名，该配置会影响文档内的跳转链接

async function connectSDK() {
    console.log('connectSDK')

    const sdk = await connect({
        fileId: fileId,
        endpoint: endpointUrl,
        signature: signature,
        token: token,
        container: document.querySelector('#iframe-container'), // iframe 挂载的目标容器元素id
        targetOrigin: '*',
        generateUrl: function (params) {
            return Promise.resolve(`${myDomain}?sdkparams=${encodeURIComponent(JSON.stringify(params))}`)
        },
    })

    console.log(sdk)
}

connectSDK()
