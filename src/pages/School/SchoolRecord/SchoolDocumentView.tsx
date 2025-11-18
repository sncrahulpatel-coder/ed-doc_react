// EdUploadPage.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { Trash2, Edit, Save } from 'lucide-react';
import './SchoolDocumentView.css';
import { useLocation } from 'react-router-dom';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import { useLoader } from '../../../context/LoaderContext';

import {
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Pagination,
} from "@mui/material";
import { confirmAlert } from '../../../utils/confirmAlert';


const isPdfUrl = (url: any) =>
    typeof url === 'string' && (url.toLowerCase().endsWith('.pdf') || url.toLowerCase().includes('.pdf'));

const normalizeItem = (item: any, idx: any) => {
    // Support various server field namings: file_url, url, fileUrl
    const fileUrl = item.file_url || item.url || item.fileUrl || item.fileUrlS3;
    return {
        id: idx + 1,
        fileName: item.title || item.fileName || `File ${idx + 1}`,
        uploadDate: item.uploaded_at ? new Date(item.uploaded_at).toLocaleDateString() : item.uploadedAt ? new Date(item.uploadedAt).toLocaleDateString() : '',
        uploadTime: item.uploaded_at ? new Date(item.uploaded_at).toLocaleTimeString() : item.uploadedAt ? new Date(item.uploadedAt).toLocaleTimeString() : '',
        imageUrl: fileUrl || '',
        size: item.file_size || item.size || 0,
        raw: item,
    };
};

const EdUploadPage = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [newFileName, setNewFileName] = useState("");
    const [newFile, setNewFile] = useState<any>(null);
    const [editFileName, setEditFileName] = useState("");

    const location = useLocation();
    const { title, type } = (location.state as { type: any, title: any }) || { type: null, title: null };
    const searchText: any = "";
    const [selectedId, setSelectedId] = useState(null);
    const [documents, setDocuments] = useState<any>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [isFullView, setIsFullView] = useState(false);
    const [previewPdfUrl, setPreviewPdfUrl] = useState(null);

    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const { showLoader, hideLoader } = useLoader();

    const getList = async () => {
        try {
            showLoader();
            const res = await api.post('/DocumentList', { type });
            // Option 1: response is an array of objects
            const data = res.data?.data || res.data || [];
            const arr = Array.isArray(data) ? data : (data.documents || []);
            const mapped = arr.map((it: any, idx: any) => normalizeItem(it, idx));
            setDocuments(mapped);
            if (mapped.length > 0) setSelectedId(mapped[0].id);
            setPage(1);
        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.message || "Something went wrong while fetching documents");
        } finally {
            hideLoader();
        }
    };

    useEffect(() => {
        getList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type]);

    // Filter & pagination
    const filtered = useMemo(() => {
        if (!searchText) return documents;
        const q = searchText.toLowerCase();
        return documents.filter((d: { fileName: any; imageUrl: any; }) =>
            (d.fileName || '').toLowerCase().includes(q) ||
            (d.imageUrl || '').toLowerCase().includes(q)
        );
    }, [documents, searchText]);

    const pageCount = Math.max(1, Math.ceil(filtered.length / rowsPerPage));

    const currentPageRows = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        return filtered.slice(start, start + rowsPerPage);
    }, [filtered, page, rowsPerPage]);

    const selectedDoc = documents.find((doc: { id: null; }) => doc.id === selectedId) || null;

    const handleDelete = async (id: any) => {
        try {
            const conf = await confirmAlert("Are you sure want to Delete.?",
                "It will Permanently Deleted")
                if (!conf) {
                    setIsEditing(false);
                    return 0;
                }
                showLoader();
            if (!conf) return;

            await api.post('/deleteDocument', { id:id-1 ,type});


            const newDocs = documents.filter((doc: { id: any; }) => doc.id !== id);
            setDocuments(newDocs);
            toast.success('Document removed');

            if (selectedId === id && newDocs.length > 0) {
                setSelectedId(newDocs[0].id);
            } else if (newDocs.length === 0) {
                setSelectedId(null);
            }
            getList()
        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.message || "Something went wrong");
        } finally {
            setIsEditing(false);
            hideLoader();
        }

    };

    const handleUpdate = (id: any) => {
        const doc = documents.find((d: { id: any; }) => d.id === id);
        setEditFileName(doc?.fileName || "");
        setIsEditing(true);
        setSelectedId(id);
    };


    // Replace the selected document's file (local only)
    const handleSave = async (index: any) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*,.pdf';
        input.onchange = async (e: any) => {
            try {
                const file = e.target.files[0];
                if (!file) return;

                const conf = await confirmAlert("Are you sure want to Update.?",
                    "Once Updated you can't change the file")
                if (!conf) {
                    setIsEditing(false);
                    return 0;
                }
                showLoader();

                const fileExtension = file.name.split('.').pop();

                const metaData = {
                    title: editFileName,

                    fileName: file.name,
                    type: type,
                    fileIndex: index - 1,
                    fileType: file.type,
                    fileSize: file.size,
                    extension: fileExtension,
                };

                const res = await api.post('/UpdateDocument', metaData);
                console.log(res.data.data)
                const awsUpload = await fetch(res.data.data.uploadUrl, {
                    method: "PUT",
                    headers: { "Content-Type": file.type },
                    body: file,
                });

                if (!awsUpload.ok) throw new Error("Failed to upload file to AWS S3");

                getList();

                if (file.type === 'application/pdf' || isPdfUrl(file.name)) {
                    const blobUrl = URL.createObjectURL(file);
                    setDocuments((prev: any[]) => prev.map(d => d.id === selectedId ? { ...d, imageUrl: blobUrl, size: file.size } : d));
                    toast.success('PDF replaced locally.');
                } else {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                        const result = ev.target?.result;
                        if (typeof result === 'string') {
                            setDocuments((prev: any[]) => prev.map(d => d.id === selectedId ? { ...d, imageUrl: result, size: file.size } : d));
                            toast.success('Image replaced locally.');
                        }
                    };
                    reader.readAsDataURL(file);
                }

            } catch (err: any) {
                console.error(err);
                toast.error(err.response?.data?.message || "Something went wrong");
            } finally {
                setIsEditing(false);
                hideLoader();
            }
        };
        input.click();


    };

    // Add document flow (get upload url -> PUT -> add to list)
    const handleAddDocument = async () => {
        if (!newFile || !newFileName.trim()) {
            alert("Please provide file name and select a file!");
            return;
        }

        const fileExtension = newFile.name.split('.').pop();
        const fileType = newFile.type;
        const fileSize = newFile.size;

        const metaData = {
            title: newFileName,
            fileName: newFile.name,
            type: type,
            fileType,
            fileSize,
            extension: fileExtension,
        };

        try {
            showLoader();
            const response = await api.post("/document/get-upload-url", metaData);
            const uploadUrl = response.data.data.uploadUrl;
            const finalFileUrl = response.data.data.fileUrl; // backend must return final S3 URL

            const awsUpload = await fetch(uploadUrl, {
                method: "PUT",
                headers: { "Content-Type": newFile.type },
                body: newFile,
            });

            if (!awsUpload.ok) throw new Error("Failed to upload file to AWS S3");

            setDocuments((prev: string | any[]) => [
                ...prev,
                {
                    id: prev.length + 1,
                    fileName: newFileName,
                    uploadDate: new Date().toLocaleDateString(),
                    uploadTime: new Date().toLocaleTimeString(),
                    imageUrl: finalFileUrl,
                    size: newFile.size,
                    raw: { uploaded_at: new Date().toISOString() },
                }
            ]);

            setShowAddModal(false);
            setNewFile(null);
            setNewFileName("");
            toast.success("Document uploaded successfully!");
            getList();

        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.message || "Something went wrong");
        } finally {
            hideLoader();
        }
    };

    return (
        <>
            <div className="edu-container">
                <div className="edu-wrapper">
                    <div className="edu-card">
                        <div className="edu-header shadow">
                            <h1 className="edu-title" dangerouslySetInnerHTML={{ __html: title }}></h1>
                            <div className="edu-header-underline"></div>
                            <Button variant="contained" className='btn btn-primary mt-3' onClick={() => setShowAddModal(true)}>
                                Add
                            </Button>
                        </div>

                        <div className="edu-content">
                            {/* Left: Table */}
                            <div className="edu-list-section">
                                <div className="edu-table-container">
                                    <div className="edu-table-wrapper">
                                        <Box display="flex" p={1} justifyContent="end" mb={1}>
                                            {/* <TextField
                        placeholder="Search..."
                        variant="outlined"
                        size="small"
                        value={searchText}
                        onChange={(e) => { setSearchText(e.target.value); setPage(1); }}
                        className="form-control"
                        style={{ width: 260 }}
                      /> */}

                                            <Box display="flex" alignItems="center" gap={1}>
                                                <label style={{ marginRight: 8 }}>Rows:</label>
                                                <select
                                                    value={rowsPerPage}
                                                    onChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(1); }}
                                                    className="form-control"
                                                    style={{ width: 100 }}
                                                >
                                                    {[5, 10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
                                                </select>
                                            </Box>
                                        </Box>

                                        <TableContainer component={Paper} className="edu-table-container-paper">
                                            <Table className="edu-table" size="small" aria-label="documents table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell className="edu-th edu-th-srno">Sr No</TableCell>
                                                        <TableCell className="edu-th edu-th-filename">File Name</TableCell>
                                                        <TableCell className="edu-th edu-th-date">Upload Date/Time</TableCell>
                                                        <TableCell className="edu-th edu-th-access" style={{ textAlign: 'center' }}>Access</TableCell>
                                                    </TableRow>
                                                </TableHead>

                                                <TableBody {...{}}>
                                                    {currentPageRows.map((doc: any) => (
                                                        <TableRow
                                                            key={doc.id}
                                                            onClick={() => setSelectedId(doc.id)}
                                                            className={`edu-row ${selectedId === doc.id ? 'edu-row-selected' : ''}`}
                                                            style={{ cursor: 'pointer' }}
                                                        >
                                                            <TableCell className="edu-td edu-td-srno">{doc.id}</TableCell>
                                                            <TableCell className="edu-td edu-td-filename" dangerouslySetInnerHTML={{ __html: doc.fileName }} />
                                                            <TableCell className="edu-td edu-td-date">
                                                                <div>{doc.uploadDate} {doc.uploadTime}</div>
                                                            </TableCell>
                                                            <TableCell className="edu-td edu-td-actions">
                                                                <div className="edu-action-buttons">
                                                                    <Button
                                                                        onClick={(e) => { e.stopPropagation(); handleUpdate(doc.id); }}
                                                                        className="edu-btn edu-btn-update"
                                                                        title="Update"
                                                                        variant="outlined"
                                                                        size="small"
                                                                    >
                                                                        <Edit size={16} />
                                                                    </Button>

                                                                    <Button
                                                                        onClick={(e) => { e.stopPropagation(); handleDelete(doc.id); }}
                                                                        className="edu-btn edu-btn-delete"
                                                                        title="Delete"
                                                                        variant="outlined"
                                                                        size="small"
                                                                        style={{ marginLeft: 6 }}
                                                                    >
                                                                        <Trash2 size={16} />
                                                                    </Button>

                                                                    <Button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            if (isPdfUrl(doc.imageUrl)) {
                                                                                setPreviewPdfUrl(doc.imageUrl);
                                                                            } else {
                                                                                setSelectedId(doc.id);
                                                                                setIsFullView(true);
                                                                            }
                                                                        }}
                                                                        className="edu-btn edu-btn-update"
                                                                        title="Preview"
                                                                        variant="outlined"
                                                                        size="small"
                                                                        style={{ marginLeft: 6 }}
                                                                    >
                                                                        View
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}

                                                    {currentPageRows.length === 0 && (
                                                        <TableRow>
                                                            <TableCell colSpan={4} style={{ textAlign: 'center' }}>
                                                                No documents found.
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>

                                        <Box display="flex" justifyContent="end" p={2} alignItems="center">
                                            {/* <Box>
                        <Button variant="outlined" size="small" onClick={() => { setPage(1); }}>
                          {'<<'}
                        </Button>
                        <Button variant="outlined" size="small" onClick={() => { setPage(p => Math.max(1, p - 1)); }} style={{ marginLeft: 8 }}>
                          {'<'}
                        </Button>
                        <Button variant="outlined" size="small" onClick={() => { setPage(p => Math.min(pageCount, p + 1)); }} style={{ marginLeft: 8 }}>
                          {'>'}
                        </Button>
                        <Button variant="outlined" size="small" onClick={() => { setPage(pageCount); }} style={{ marginLeft: 8 }}>
                          {'>>'}
                        </Button>
                      </Box> */}

                                            <Box display="flex" alignItems="center" gap={2}>
                                                <span>Page <strong>{page}</strong> of {pageCount}</span>

                                                <Pagination
                                                    count={pageCount}
                                                    page={page}
                                                    onChange={(e, value) => setPage(value)}
                                                    color="primary"
                                                    shape="rounded"
                                                    size="small"
                                                />
                                            </Box>
                                        </Box>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side - Preview */}
                            <div className="edu-preview-section">
                                <div className="edu-preview-container">
                                    {selectedDoc ? (
                                        <div className="edu-preview-content">
                                            <div className="edu-preview-header">
                                                <h2 className="edu-preview-title">Document Preview<span style={{ color: '#b3afaf75' }}> (Click to view Full imgage) </span></h2>
                                                {isEditing && selectedId && (
                                                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            style={{ width: 200 }}
                                                            value={editFileName}
                                                            onChange={(e) => setEditFileName(e.target.value)}
                                                            placeholder="Enter file name"
                                                        />

                                                        <Button
                                                            onClick={() => { handleSave(selectedDoc.id) }}
                                                            className="edu-btn edu-btn-save"
                                                            variant="contained"
                                                            size="small"
                                                        >
                                                            <Save size={16} />
                                                            Upload
                                                        </Button>
                                                    </div>
                                                )}

                                            </div>

                                            <div className="edu-image-wrapper">
                                                {isPdfUrl(selectedDoc.imageUrl) ? (
                                                    <div style={{ width: '100%', height: 400 }}>
                                                        <iframe title={`pdf-preview-${selectedDoc.id}`} src={selectedDoc.imageUrl} style={{ width: '100%', height: '100%', border: 'none' }} />
                                                    </div>
                                                ) : (
                                                    <img
                                                        src={selectedDoc.imageUrl}
                                                        alt={`Document ${selectedDoc.id}`}
                                                        className="edu-image"
                                                        onClick={() => setIsFullView(true)}
                                                        title="Click for full view"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="edu-no-document">
                                            <p>No document selected</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Full View Modal */}
                {isFullView && selectedDoc && !isPdfUrl(selectedDoc.imageUrl) && (
                    <div className="edu-modal-overlay" onClick={() => setIsFullView(false)}>
                        <div className="edu-modal-content" onClick={(e) => e.stopPropagation()}>
                            <button className="edu-modal-close" onClick={() => setIsFullView(false)}>✕</button>
                            <img src={selectedDoc.imageUrl} alt={`Document ${selectedDoc.id} - Full View`} className="edu-modal-image" />
                        </div>
                    </div>
                )}

                {/* PDF Modal */}
                {previewPdfUrl && (
                    <div className="edu-modal-overlay" onClick={() => setPreviewPdfUrl(null)}>
                        <div className="edu-modal-content" onClick={(e) => e.stopPropagation()}>
                            <button className="edu-modal-close" onClick={() => setPreviewPdfUrl(null)}>✕</button>
                            <iframe title="pdf-full" src={previewPdfUrl} style={{ width: '100%', height: '80vh', border: 'none', minWidth: '600px' }} />
                        </div>
                    </div>
                )}
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="edu-modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="edu-modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Add New Document</h2>

                        <label className="mt-2">File Name</label>
                        <input
                            type="text"
                            className="form-control"
                            value={newFileName}
                            onChange={(e) => setNewFileName(e.target.value)}
                            placeholder="Enter file name"
                        />

                        <label className="mt-3">Choose File (Image or PDF only)</label>
                        <input
                            type="file"
                            className="form-control"
                            accept="image/*,.pdf"
                            onChange={(e: any) => {
                                const selected = e.target.files[0];
                                if (!selected) return;

                                const allowed = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];
                                if (!allowed.includes(selected.type)) {
                                    alert("Only Image or PDF allowed!");
                                    return;
                                }

                                const sizeMB = selected.size / (1024 * 1024); // Convert to MB
                                if (sizeMB > 50) {
                                    alert("Maximum file size allowed is 50 MB!");
                                    return;
                                }

                                setNewFile(selected);
                            }}
                        />

                        <div className="mt-4 d-flex justify-content-between">
                            <Button className="btn btn-secondary" onClick={() => setShowAddModal(false)} variant="outlined">Cancel</Button>
                            <Button className="btn btn-success" onClick={handleAddDocument} variant="contained">Save</Button>
                        </div>
                    </div>
                </div>
            )}

        </>
    );
};

export default EdUploadPage;
